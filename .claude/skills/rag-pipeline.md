# RAG Pipeline Skill

RAG must:
- Separate ingestion, indexing, retrieval, generation
- Store sources/citations per answer
- Prefer grounded answers; if retrieval is empty, say so
- Provide a reindex script later (e.g., npm run rag:index)
