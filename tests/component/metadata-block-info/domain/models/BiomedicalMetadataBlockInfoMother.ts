import { MetadataBlockInfo } from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'

export class BiomedicalMetadataBlockInfoMother {
  static get(): MetadataBlockInfo {
    return {
      id: 5,
      name: 'biomedical',
      displayName: 'Life Sciences Metadata',
      displayOnCreate: false,
      metadataFields: {
        studyDesignType: {
          name: 'studyDesignType',
          displayName: 'Design Type',
          title: 'Design Type',
          type: 'TEXT',
          watermark: '',
          description: 'Design types that are based on the overall experimental design.',
          multiple: true,
          isControlledVocabulary: true,
          controlledVocabularyValues: [
            'Case Control',
            'Cross Sectional',
            'Cohort Study',
            'Nested Case Control Design',
            'Not Specified',
            'Parallel Group Design',
            'Perturbation Design',
            'Randomized Controlled Trial',
            'Technological Design',
            'Other'
          ],
          displayFormat: '',
          isRequired: false,
          displayOrder: 0,
          typeClass: 'controlledVocabulary',
          displayOnCreate: false
        },
        studyOtherDesignType: {
          name: 'studyOtherDesignType',
          displayName: 'Other Design Type',
          title: 'Other Design Type',
          type: 'TEXT',
          watermark: '',
          description:
            'If Other was selected in Design Type, list any other design types that were used in this Dataset.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 1,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        studyFactorType: {
          name: 'studyFactorType',
          displayName: 'Factor Type',
          title: 'Factor Type',
          type: 'TEXT',
          watermark: '',
          description: 'Factors used in the Dataset.',
          multiple: true,
          isControlledVocabulary: true,
          controlledVocabularyValues: [
            'Age',
            'Biomarkers',
            'Cell Surface Markers',
            'Cell Type/Cell Line',
            'Developmental Stage',
            'Disease State',
            'Drug Susceptibility',
            'Extract Molecule',
            'Genetic Characteristics',
            'Immunoprecipitation Antibody',
            'Organism',
            'Passages',
            'Platform',
            'Sex',
            'Strain',
            'Time Point',
            'Tissue Type',
            'Treatment Compound',
            'Treatment Type',
            'Other'
          ],
          displayFormat: '',
          isRequired: false,
          displayOrder: 2,
          typeClass: 'controlledVocabulary',
          displayOnCreate: false
        },
        studyOtherFactorType: {
          name: 'studyOtherFactorType',
          displayName: 'Other Factor Type',
          title: 'Other Factor Type',
          type: 'TEXT',
          watermark: '',
          description:
            'If Other was selected in Factor Type, list any other factor types that were used in this Dataset.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 3,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        studyAssayOrganism: {
          name: 'studyAssayOrganism',
          displayName: 'Organism',
          title: 'Organism',
          type: 'TEXT',
          watermark: '',
          description:
            'The taxonomic name of the organism used in the Dataset or from which the  starting biological material derives.',
          multiple: true,
          isControlledVocabulary: true,
          controlledVocabularyValues: [
            'Arabidopsis thaliana',
            'Bos taurus',
            'Caenorhabditis elegans',
            'Chlamydomonas reinhardtii',
            'Danio rerio (zebrafish)',
            'Dictyostelium discoideum',
            'Drosophila melanogaster',
            'Escherichia coli',
            'Hepatitis C virus',
            'Homo sapiens',
            'Mus musculus',
            'Mycobacterium africanum',
            'Mycobacterium canetti',
            'Mycobacterium tuberculosis',
            'Mycoplasma pneumoniae',
            'Oryza sativa',
            'Plasmodium falciparum',
            'Pneumocystis carinii',
            'Rattus norvegicus',
            "Saccharomyces cerevisiae (brewer's yeast)",
            'Schizosaccharomyces pombe',
            'Takifugu rubripes',
            'Xenopus laevis',
            'Zea mays',
            'Other'
          ],
          displayFormat: '',
          isRequired: false,
          displayOrder: 4,
          typeClass: 'controlledVocabulary',
          displayOnCreate: false
        },
        studyAssayOtherOrganism: {
          name: 'studyAssayOtherOrganism',
          displayName: 'Other Organism',
          title: 'Other Organism',
          type: 'TEXT',
          watermark: '',
          description:
            'If Other was selected in Organism, list any other organisms that were used in this Dataset. Terms from the NCBI Taxonomy are recommended.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 5,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        studyAssayMeasurementType: {
          name: 'studyAssayMeasurementType',
          displayName: 'Measurement Type',
          title: 'Measurement Type',
          type: 'TEXT',
          watermark: '',
          description:
            'A term to qualify the endpoint, or what is being measured (e.g. gene expression profiling; protein identification).',
          multiple: true,
          isControlledVocabulary: true,
          controlledVocabularyValues: [
            'cell counting',
            'cell sorting',
            'clinical chemistry analysis',
            'copy number variation profiling',
            'DNA methylation profiling',
            'DNA methylation profiling (Bisulfite-Seq)',
            'DNA methylation profiling (MeDIP-Seq)',
            'drug susceptibility',
            'environmental gene survey',
            'genome sequencing',
            'hematology',
            'histology',
            'Histone Modification (ChIP-Seq)',
            'loss of heterozygosity profiling',
            'metabolite profiling',
            'metagenome sequencing',
            'protein expression profiling',
            'protein identification',
            'protein-DNA binding site identification',
            'protein-protein interaction detection',
            'protein-RNA binding (RIP-Seq)',
            'SNP analysis',
            'targeted sequencing',
            'transcription factor binding (ChIP-Seq)',
            'transcription factor binding site identification',
            'transcription profiling',
            'transcription profiling (Microarray)',
            'transcription profiling (RNA-Seq)',
            'TRAP translational profiling',
            'Other'
          ],
          displayFormat: '',
          isRequired: false,
          displayOrder: 6,
          typeClass: 'controlledVocabulary',
          displayOnCreate: false
        },
        studyAssayOtherMeasurmentType: {
          name: 'studyAssayOtherMeasurmentType',
          displayName: 'Other Measurement Type',
          title: 'Other Measurement Type',
          type: 'TEXT',
          watermark: '',
          description:
            'If Other was selected in Measurement Type, list any other measurement types that were used. Terms from NCBO Bioportal are recommended.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 7,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        studyAssayTechnologyType: {
          name: 'studyAssayTechnologyType',
          displayName: 'Technology Type',
          title: 'Technology Type',
          type: 'TEXT',
          watermark: '',
          description:
            'A term to identify the technology used to perform the measurement (e.g. DNA microarray; mass spectrometry).',
          multiple: true,
          isControlledVocabulary: true,
          controlledVocabularyValues: [
            'culture based drug susceptibility testing, single concentration',
            'culture based drug susceptibility testing, two concentrations',
            'culture based drug susceptibility testing, three or more concentrations (minimium inhibitory concentration measurement)',
            'DNA microarray',
            'flow cytometry',
            'gel electrophoresis',
            'mass spectrometry',
            'NMR spectroscopy',
            'nucleotide sequencing',
            'protein microarray',
            'real time PCR',
            'no technology required',
            'Other'
          ],
          displayFormat: '',
          isRequired: false,
          displayOrder: 8,
          typeClass: 'controlledVocabulary',
          displayOnCreate: false
        },
        studyAssayOtherTechnologyType: {
          name: 'studyAssayOtherTechnologyType',
          displayName: 'Other Technology Type',
          title: 'Other Technology Type',
          type: 'TEXT',
          watermark: '',
          description:
            'If Other was selected in Technology Type, list any other technology types that were used in this Dataset.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 9,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        studyAssayPlatform: {
          name: 'studyAssayPlatform',
          displayName: 'Technology Platform',
          title: 'Technology Platform',
          type: 'TEXT',
          watermark: '',
          description:
            'The manufacturer and name of the technology platform used in the assay (e.g. Bruker AVANCE).',
          multiple: true,
          isControlledVocabulary: true,
          controlledVocabularyValues: [
            '210-MS GC Ion Trap (Varian)',
            '220-MS GC Ion Trap (Varian)',
            '225-MS GC Ion Trap (Varian)',
            '240-MS GC Ion Trap (Varian)',
            '300-MS quadrupole GC/MS (Varian)',
            '320-MS LC/MS (Varian)',
            '325-MS LC/MS (Varian)',
            '320-MS GC/MS (Varian)',
            '500-MS LC/MS (Varian)',
            '800D (Jeol)',
            '910-MS TQ-FT (Varian)',
            '920-MS TQ-FT (Varian)',
            '3100 Mass Detector (Waters)',
            '6110 Quadrupole LC/MS (Agilent)',
            '6120 Quadrupole LC/MS (Agilent)',
            '6130 Quadrupole LC/MS (Agilent)',
            '6140 Quadrupole LC/MS (Agilent)',
            '6310 Ion Trap LC/MS (Agilent)',
            '6320 Ion Trap LC/MS (Agilent)',
            '6330 Ion Trap LC/MS (Agilent)',
            '6340 Ion Trap LC/MS (Agilent)',
            '6410 Triple Quadrupole LC/MS (Agilent)',
            '6430 Triple Quadrupole LC/MS (Agilent)',
            '6460 Triple Quadrupole LC/MS (Agilent)',
            '6490 Triple Quadrupole LC/MS (Agilent)',
            '6530 Q-TOF LC/MS (Agilent)',
            '6540 Q-TOF LC/MS (Agilent)',
            '6210 TOF LC/MS (Agilent)',
            '6220 TOF LC/MS (Agilent)',
            '6230 TOF LC/MS (Agilent)',
            '7000B Triple Quadrupole GC/MS (Agilent)',
            'AccuTO DART (Jeol)',
            'AccuTOF GC (Jeol)',
            'AccuTOF LC (Jeol)',
            'ACQUITY SQD (Waters)',
            'ACQUITY TQD (Waters)',
            'Agilent',
            'Agilent 5975E GC/MSD (Agilent)',
            'Agilent 5975T LTM GC/MSD (Agilent)',
            '5975C Series GC/MSD (Agilent)',
            'Affymetrix',
            'amaZon ETD ESI Ion Trap (Bruker)',
            'amaZon X ESI Ion Trap (Bruker)',
            'apex-ultra hybrid Qq-FTMS (Bruker)',
            'API 2000 (AB Sciex)',
            'API 3200 (AB Sciex)',
            'API 3200 QTRAP (AB Sciex)',
            'API 4000 (AB Sciex)',
            'API 4000 QTRAP (AB Sciex)',
            'API 5000 (AB Sciex)',
            'API 5500 (AB Sciex)',
            'API 5500 QTRAP (AB Sciex)',
            'Applied Biosystems Group (ABI)',
            'AQI Biosciences',
            'Atmospheric Pressure GC (Waters)',
            'autoflex III MALDI-TOF MS (Bruker)',
            'autoflex speed(Bruker)',
            'AutoSpec Premier (Waters)',
            'AXIMA Mega TOF (Shimadzu)',
            'AXIMA Performance MALDI TOF/TOF (Shimadzu)',
            'A-10 Analyzer (Apogee)',
            'A-40-MiniFCM (Apogee)',
            'Bactiflow (Chemunex SA)',
            'Base4innovation',
            'BD BACTEC MGIT 320',
            'BD BACTEC MGIT 960',
            'BD Radiometric BACTEC 460TB',
            'BioNanomatrix',
            'Cell Lab Quanta SC (Becman Coulter)',
            'Clarus 560 D GC/MS (PerkinElmer)',
            'Clarus 560 S GC/MS (PerkinElmer)',
            'Clarus 600 GC/MS (PerkinElmer)',
            'Complete Genomics',
            'Cyan (Dako Cytomation)',
            'CyFlow ML (Partec)',
            'Cyow SL (Partec)',
            'CyFlow SL3 (Partec)',
            'CytoBuoy (Cyto Buoy Inc)',
            'CytoSence (Cyto Buoy Inc)',
            'CytoSub (Cyto Buoy Inc)',
            'Danaher',
            'DFS (Thermo Scientific)',
            'Exactive(Thermo Scientific)',
            'FACS Canto (Becton Dickinson)',
            'FACS Canto2 (Becton Dickinson)',
            'FACS Scan (Becton Dickinson)',
            'FC 500 (Becman Coulter)',
            'GCmate II GC/MS (Jeol)',
            'GCMS-QP2010 Plus (Shimadzu)',
            'GCMS-QP2010S Plus (Shimadzu)',
            'GCT Premier (Waters)',
            'GENEQ',
            'Genome Corp.',
            'GenoVoxx',
            'GnuBio',
            'Guava EasyCyte Mini (Millipore)',
            'Guava EasyCyte Plus (Millipore)',
            'Guava Personal Cell Analysis (Millipore)',
            'Guava Personal Cell Analysis-96 (Millipore)',
            'Helicos BioSciences',
            'Illumina',
            'Indirect proportion method on LJ medium',
            'Indirect proportion method on Middlebrook Agar 7H9',
            'Indirect proportion method on Middlebrook Agar 7H10',
            'Indirect proportion method on Middlebrook Agar 7H11',
            'inFlux Analyzer (Cytopeia)',
            'Intelligent Bio-Systems',
            'ITQ 700 (Thermo Scientific)',
            'ITQ 900 (Thermo Scientific)',
            'ITQ 1100 (Thermo Scientific)',
            'JMS-53000 SpiralTOF (Jeol)',
            'LaserGen',
            'LCMS-2020 (Shimadzu)',
            'LCMS-2010EV (Shimadzu)',
            'LCMS-IT-TOF (Shimadzu)',
            'Li-Cor',
            'Life Tech',
            'LightSpeed Genomics',
            'LCT Premier XE (Waters)',
            'LCQ Deca XP MAX (Thermo Scientific)',
            'LCQ Fleet (Thermo Scientific)',
            'LXQ (Thermo Scientific)',
            'LTQ Classic (Thermo Scientific)',
            'LTQ XL (Thermo Scientific)',
            'LTQ Velos (Thermo Scientific)',
            'LTQ Orbitrap Classic (Thermo Scientific)',
            'LTQ Orbitrap XL (Thermo Scientific)',
            'LTQ Orbitrap Discovery (Thermo Scientific)',
            'LTQ Orbitrap Velos (Thermo Scientific)',
            'Luminex 100 (Luminex)',
            'Luminex 200 (Luminex)',
            'MACS Quant (Miltenyi)',
            'MALDI SYNAPT G2 HDMS (Waters)',
            'MALDI SYNAPT G2 MS (Waters)',
            'MALDI SYNAPT HDMS (Waters)',
            'MALDI SYNAPT MS (Waters)',
            'MALDI micro MX (Waters)',
            'maXis (Bruker)',
            'maXis G4 (Bruker)',
            'microflex LT MALDI-TOF MS (Bruker)',
            'microflex LRF MALDI-TOF MS (Bruker)',
            'microflex III MALDI-TOF MS (Bruker)',
            'micrOTOF II ESI TOF (Bruker)',
            'micrOTOF-Q II ESI-Qq-TOF (Bruker)',
            'microplate Alamar Blue (resazurin) colorimetric method',
            'Mstation (Jeol)',
            'MSQ Plus (Thermo Scientific)',
            'NABsys',
            'Nanophotonics Biosciences',
            'Network Biosystems',
            'Nimblegen',
            'Oxford Nanopore Technologies',
            'Pacific Biosciences',
            'Population Genetics Technologies',
            'Q1000GC UltraQuad (Jeol)',
            'Quattro micro API (Waters)',
            'Quattro micro GC (Waters)',
            'Quattro Premier XE (Waters)',
            'QSTAR (AB Sciex)',
            'Reveo',
            'Roche',
            'Seirad',
            'solariX hybrid Qq-FTMS (Bruker)',
            'Somacount (Bently Instruments)',
            'SomaScope (Bently Instruments)',
            'SYNAPT G2 HDMS (Waters)',
            'SYNAPT G2 MS (Waters)',
            'SYNAPT HDMS (Waters)',
            'SYNAPT MS (Waters)',
            'TripleTOF 5600 (AB Sciex)',
            'TSQ Quantum Ultra (Thermo Scientific)',
            'TSQ Quantum Access (Thermo Scientific)',
            'TSQ Quantum Access MAX (Thermo Scientific)',
            'TSQ Quantum Discovery MAX (Thermo Scientific)',
            'TSQ Quantum GC (Thermo Scientific)',
            'TSQ Quantum XLS (Thermo Scientific)',
            'TSQ Vantage (Thermo Scientific)',
            'ultrafleXtreme MALDI-TOF MS (Bruker)',
            'VisiGen Biotechnologies',
            'Xevo G2 QTOF (Waters)',
            'Xevo QTof MS (Waters)',
            'Xevo TQ MS (Waters)',
            'Xevo TQ-S (Waters)',
            'Other'
          ],
          displayFormat: '',
          isRequired: false,
          displayOrder: 10,
          typeClass: 'controlledVocabulary',
          displayOnCreate: false
        },
        studyAssayOtherPlatform: {
          name: 'studyAssayOtherPlatform',
          displayName: 'Other Technology Platform',
          title: 'Other Technology Platform',
          type: 'TEXT',
          watermark: '',
          description:
            'If Other was selected in Technology Platform, list any other technology platforms that were used in this Dataset.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 11,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        studyAssayCellType: {
          name: 'studyAssayCellType',
          displayName: 'Cell Type',
          title: 'Cell Type',
          type: 'TEXT',
          watermark: '',
          description: 'The name of the cell line from which the source or sample derives.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 12,
          typeClass: 'primitive',
          displayOnCreate: false
        }
      }
    }
  }
}
