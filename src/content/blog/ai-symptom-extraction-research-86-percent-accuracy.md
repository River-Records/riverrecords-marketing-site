---
title: "Task definition, annotated dataset, and supervised natural language processing models for symptom extraction from unstructured clinical notes"
description: "Research achieves 86% accuracy extracting symptoms from clinical notes using AI. Learn how natural language processing enables real-time symptom identification."
seoTitle: "AI Symptom Extraction Research: 86% Accuracy from Clinical Notes"
seoDescription: "Research achieves 86% accuracy extracting symptoms from clinical notes using AI. Learn how natural language processing enables real-time symptom identification."
author: "Jackson Steinkamp"
publishDate: "2019-12-27"
image: "https://framerusercontent.com/images/AJiHJ7DdaiixEauiO3W58JyTU.webp"
featured: false
tags: []
draft: false
---

**Authors**: Jackson Steinkamp; Wasif Bala; Abhinav Sharma; Jacob Kantrowitz

**Published**: December 26, 2019

**Journal**: Journal of Biomedical Informatics

**Abstract**: 

**Introduction**: Machine learning (ML) and natural language processing have great potential to improve information extraction (IE) within electronic medical records (EMRs) for a wide variety of clinical search and summarization tools. Despite ML advancements, clinical adoption of real time IE tools for patient care remains low. Clinically motivated IE task definitions, publicly available annotated clinical datasets, and inclusion of subtasks such as coreference resolution and named entity normalization are critical for the development of useful clinical tools.

**Materials and methods**: We provide a task definition and comprehensive annotation requirements for a clinically motivated symptom extraction task. Four annotators labeled symptom mentions within 1108 discharge summaries from two public clinical note datasets for the tasks of named entity recognition, coreference resolution, and named entity normalization; these annotations will be released to the public. Baseline human performance was assessed and two ML models were evaluated on the symptom extraction task.

**Results**: 16,922 symptom mentions were identified within the discharge summaries, with 11,944 symptom instances after coreference resolution and 1255 unique normalized answer forms. Human annotator performance averaged 92.2% F1. Recurrent network model performance was 85.6% F1 (recall 85.8%, precision 85.4%), and Transformer-based model performance was 86.3% F1 (recall 86.6%, precision 86.1%). Our models extracted vague symptoms, acronyms, typographical errors, and grouping statements. The models generalized effectively to a separate clinical note corpus and can run in real time.

**Conclusion**: To our knowledge, this dataset will be the largest and most comprehensive publicly released, annotated dataset for clinically motivated symptom extraction, as it includes annotations for named entity recognition, coreference, and normalization for more than 1000 clinical documents. Our neural network models extracted symptoms from unstructured clinical free text at near human performance in real time. In this paper, we present a clinically motivated task definition, dataset, and simple supervised natural language processing models to demonstrate the feasibility of building clinically applicable information extraction tools.

**[Read Full Text On Science Direct](https://www.sciencedirect.com/science/article/pii/S153204641930276X?via%3Dihub)**
