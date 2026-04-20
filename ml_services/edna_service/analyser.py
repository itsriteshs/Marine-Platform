# backend/edna_service/analyzer.py
from Bio.Blast import NCBIWWW
from Bio.Blast import NCBIXML
import os

def analyze_sequence(file_path: str) -> dict:
    # 1. Read the uploaded file
    with open(file_path, "r") as f:
        raw_content = f.read()

    # 2. Calculate local sequence stats (ignoring FASTA headers starting with '>')
    lines = raw_content.splitlines()
    sequence_only = "".join([line.upper() for line in lines if not line.startswith(">")])
    clean_seq = "".join([char for char in sequence_only if char in "ACTG"])
    
    seq_length = len(clean_seq)
    
    if seq_length == 0:
        raise ValueError("No valid DNA sequence found in the file.")
        
    g_count = clean_seq.count('G')
    c_count = clean_seq.count('C')
    gc_content = ((g_count + c_count) / seq_length * 100)

    # 3. Send to NCBI BLAST (BlastN = nucleotide database)
    # Using 'nt' database (the main NCBI nucleotide database)
    try:
        print("Sending sequence to NCBI BLAST... This may take a few minutes.")
        result_handle = NCBIWWW.qblast("blastn", "nt", raw_content)
    except Exception as e:
        raise Exception(f"Failed to connect to NCBI BLAST: {str(e)}")

    # 4. Parse the XML results
    blast_records = NCBIXML.parse(result_handle)
    blast_record = next(blast_records)

    if not blast_record.alignments:
        raise Exception("No matching sequences found in the NCBI database.")

    # 5. Extract the Top Match (Primary)
    top_alignment = blast_record.alignments[0]
    top_hsp = top_alignment.hsps[0]
    primary_identity = (top_hsp.identities / top_hsp.align_length) * 100

    # Clean up the NCBI title (it usually has a bunch of pipeline IDs at the start)
    primary_name = top_alignment.title.split("|")[-1].strip()

    # 6. Extract Secondary Matches (Next 2 hits)
    secondary_matches = []
    for alignment in blast_record.alignments[1:3]:
        hsp = alignment.hsps[0]
        identity = (hsp.identities / hsp.align_length) * 100
        name = alignment.title.split("|")[-1].strip()
        
        # Keep the name somewhat short for the UI
        if len(name) > 60:
            name = name[:57] + "..."
            
        secondary_matches.append({
            "name": name,
            "match_pct": round(identity, 2)
        })

    return {
        "sequence_stats": {
            "length_bp": seq_length,
            "gc_content_pct": round(gc_content, 2),
        },
        "primary_match": {
            "name": primary_name,
            "match_pct": round(primary_identity, 2),
            "habitat": "Marine/Aquatic" # NCBI doesn't provide habitat directly via basic BLAST
        },
        "secondary_matches": secondary_matches
    }