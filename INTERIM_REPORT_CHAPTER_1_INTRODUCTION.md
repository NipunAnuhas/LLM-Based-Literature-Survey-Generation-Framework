# Chapter 1: Introduction

## 1.1 Background and Motivation

Literature surveys are fundamental components of academic research, providing comprehensive overviews of existing work in specific domains. However, the manual process of conducting literature surveys is exceptionally time-consuming, often requiring researchers to spend weeks or months identifying relevant papers, reading abstracts and full texts, evaluating quality and relevance, extracting key findings, and synthesizing information into coherent narratives. This labour-intensive process creates a significant bottleneck in research workflows, particularly for early-stage researchers who may lack experience in efficient literature review methodologies.

The emergence of Large Language Models (LLMs) such as GPT-4, Claude, and other transformer-based architectures has demonstrated remarkable capabilities in natural language understanding, summarization, and synthesis tasks. Simultaneously, the proliferation of scholarly databases with programmatic APIs (Semantic Scholar, arXiv, PubMed) has made academic literature more accessible than ever before. The convergence of these technologies presents an opportunity to automate significant portions of the literature survey process while maintaining academic rigour and quality standards.

## 1.2 Project Aims and Objectives

The primary aim of this project is to design and implement an automated system that generates comprehensive literature surveys by orchestrating multiple specialized LLMs through a workflow automation platform. The system seeks to reduce the time required for literature survey creation from weeks to hours while maintaining academic quality standards.

**Specific Objectives:**

1. **Design a multi-LLM pipeline architecture** where different models handle specialized tasks (query expansion, validation, evaluation, synthesis) based on their strengths
2. **Integrate scholarly database APIs** to retrieve relevant academic papers with comprehensive metadata
3. **Implement quality assessment mechanisms** using both quantitative metrics (citation counts, venue reputation) and LLM-based qualitative evaluation
4. **Develop automated synthesis capabilities** that generate coherent, well-structured literature reviews with proper citations
5. **Create a user-friendly web interface** enabling researchers to initiate surveys, track progress in real-time, and export results in multiple formats
6. **Ensure system reliability** through comprehensive error handling, retry mechanisms, and state persistence
7. **Validate system correctness** using both traditional unit testing and property-based testing methodologies

## 1.3 Project Scope

The project scope encompasses the development of a complete web-based application consisting of three primary layers: a React-based frontend for user interaction, a Node.js/Express backend for API services and workflow coordination, and an n8n workflow layer for LLM pipeline orchestration. The system focuses exclusively on English-language scholarly articles and targets academic researchers as the primary user base.

**In Scope:**
- Multi-LLM pipeline with four distinct stages (query expansion, validation, evaluation, synthesis)
- Integration with Semantic Scholar and arXiv APIs for paper retrieval
- Real-time progress tracking and status updates
- Export functionality for PDF, DOCX, and JSON formats
- PostgreSQL database for workflow state and survey persistence
- Comprehensive testing strategy including property-based tests

**Out of Scope:**
- Multi-language support (non-English papers)
- User authentication and multi-user collaboration features
- Advanced citation management (multiple citation formats)
- Integration with reference management tools (Zotero, Mendeley)
- Real-time collaborative editing of generated surveys

## 1.4 Report Structure

This interim report is organized into ten chapters. Following this introduction, Chapter 2 presents a comprehensive system analysis examining existing literature survey tools and identifying gaps that motivate this project. Chapter 3 details the requirements specification with twelve functional requirements derived from user stories. Chapter 4 evaluates technical, economic, operational, and schedule feasibility. Chapter 5 describes the system architecture and design, including component diagrams, data models, and workflow specifications. Chapter 6 discusses the development tools and technologies selected for implementation. Chapter 7 reports on implementation progress achieved to date, documenting completed tasks and demonstrating functionality. Chapter 8 provides critical discussion and evaluation of the work completed. Chapter 9 concludes with a summary of achievements and outlines remaining work for the final project phase. Chapter 10 lists all references cited throughout the report.

