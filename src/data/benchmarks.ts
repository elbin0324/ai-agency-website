// Sources behind the numbers on this site, generated from content/BENCHMARKS.md
// (every figure was verified at its source). Data modules and the results-page
// methodology reference these ids.

export type Source = { id: string; citation: string; url: string };

export const sources: Source[] = [
  {
    "id": "lab-01",
    "citation": "BLS Occupational Employment and Wage Statistics (OEWS), news release Table 1, May 2025 (median annual and percentiles from the BLS Public Data API), U.S. Bureau of Labor Statistics, May 2025 reference period (released Friday, May 15, 2026)",
    "url": "https://www.bls.gov/news.release/ocwage.t01.htm"
  },
  {
    "id": "lab-02",
    "citation": "BLS OEWS May 2025 national estimate for SOC 13-2051, via the BLS Public Data API (this occupation is NOT in news-release Table 1), U.S. Bureau of Labor Statistics, May 2025 (released May 15, 2026)",
    "url": "https://api.bls.gov/publicAPI/v1/timeseries/data/OEUN000000000000013205108"
  },
  {
    "id": "lab-03",
    "citation": "BLS Public Data API, OEWS national series (data type 07 = hourly 25th percentile, 09 = hourly 75th percentile), U.S. Bureau of Labor Statistics, May 2025 (API 'latest' = 2025 annual)",
    "url": "https://api.bls.gov/publicAPI/v1/timeseries/data/OEUN000000000000043405107"
  },
  {
    "id": "lab-04",
    "citation": "BLS OEWS Technical Note, May 2025 estimates; Table 1 footnote, U.S. Bureau of Labor Statistics, 2026 (May 2025 estimates)",
    "url": "https://www.bls.gov/news.release/ocwage.tn.htm"
  },
  {
    "id": "lab-05",
    "citation": "BLS Employer Costs for Employee Compensation (ECEC), June 2026 news release, U.S. Bureau of Labor Statistics, June 2026 (released Wednesday, September 9, 2026)",
    "url": "https://www.bls.gov/news.release/ecec.nr0.htm"
  },
  {
    "id": "lab-06",
    "citation": "BLS ECEC June 2026, Table 6 (private industry workers by establishment size and industry group), U.S. Bureau of Labor Statistics, June 2026 (released September 9, 2026)",
    "url": "https://www.bls.gov/news.release/ecec.t06.htm"
  },
  {
    "id": "lab-07",
    "citation": "BLS ECEC June 2026, Table 4 (private industry workers by occupational and industry group), U.S. Bureau of Labor Statistics, June 2026 (released September 9, 2026)",
    "url": "https://www.bls.gov/news.release/ecec.t04.htm"
  },
  {
    "id": "lab-08",
    "citation": "BLS ECEC June 2025 news release (archived), U.S. Bureau of Labor Statistics, June 2025 (released Friday, September 12, 2025)",
    "url": "https://www.bls.gov/news.release/archives/ecec_09122025.htm"
  },
  {
    "id": "lab-09",
    "citation": "BLS ECEC Technical Note (2026 Q2); BLS Handbook of Methods, National Compensation Measures: Concepts, U.S. Bureau of Labor Statistics, 2026",
    "url": "https://www.bls.gov/news.release/ecec.tn.htm"
  },
  {
    "id": "lab-10",
    "citation": "BLS The Economics Daily, 'Paid sick leave was available to 80 percent of private industry workers in 2025' (National Compensation Survey), U.S. Bureau of Labor Statistics, 2025 data (published February 10, 2026)",
    "url": "https://www.bls.gov/opub/ted/2026/paid-sick-leave-was-available-to-80-percent-of-private-industry-workers-in-2025.htm"
  },
  {
    "id": "lab-11",
    "citation": "BLS chart: Paid leave benefits: Average number of sick and vacation days by length of service requirement (NCS), U.S. Bureau of Labor Statistics, March 2026 reference period (release date not shown on the page)",
    "url": "https://www.bls.gov/charts/employee-benefits/paid-leave-sick-vacation-days-by-service-requirement.htm"
  },
  {
    "id": "lab-12",
    "citation": "OMB Circular A-76 (Revised May 29, 2003), Attachment C, B.2.d(2), U.S. Office of Management and Budget, 2003",
    "url": "https://georgewbush-whitehouse.archives.gov/omb/circulars/a076/a76_incl_tech_correction.html"
  },
  {
    "id": "lab-13",
    "citation": "GAO, Defense Outsourcing: Better Data Is Needed to Support Overhead Rates for A-76 Studies (GAO/NSIAD-98-62), U.S. General Accounting Office (now Government Accountability Office), February 27, 1998",
    "url": "https://www.govinfo.gov/content/pkg/GAOREPORTS-NSIAD-98-62/html/GAOREPORTS-NSIAD-98-62.htm"
  },
  {
    "id": "lab-14",
    "citation": "OPM fact sheet: Computing Hourly Rates of Pay Using the 2,087-Hour Divisor (5 U.S.C. 5504(b)), U.S. Office of Personnel Management, current fact sheet (statute 1986)",
    "url": "https://www.opm.gov/policy-data-oversight/pay-leave/pay-administration/fact-sheets/computing-hourly-rates-of-pay-using-the-2087-hour-divisor/"
  },
  {
    "id": "lab-15",
    "citation": "The Bridge Group, 2025 SDR Models, Motions & Metrics Report (10th edition), The Bridge Group, Inc. (sales consulting firm), 2025 (published February 6, 2025)",
    "url": "https://www.bridgegroupinc.com/research/2025-sdr-models-metrics-report-the-bridge-group"
  },
  {
    "id": "lab-16",
    "citation": "GSA, User Guide - CALC+ Quick Rate Hourly Labor Ceiling Rates, U.S. General Services Administration, Guide v1.3 (June 22, 2023), current on buy.gsa.gov",
    "url": "https://buy.gsa.gov/pricing/assets/documents/user-guides/CALC+%20User%20Guide%20for%20Labor%20Ceiling%20Rates.pdf"
  },
  {
    "id": "lab-17",
    "citation": "General Services Administration Acquisition Manual (GSAM) 538.270-1, Evaluation of offers without access to transactional data, U.S. General Services Administration (acquisition.gov), current regulation (accessed 2026-10-12)",
    "url": "https://www.acquisition.gov/gsam/538.270-1"
  },
  {
    "id": "lab-18",
    "citation": "GSA CALC+ Labor Ceiling Rates API (keyword 'management consultant', business_size = S); checker's recomputation over all downloaded records, U.S. General Services Administration, Data as of 2026-10-12 (index ceilingrates-2026-10-12_02-00-02)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=management%20consultant&page=1&page_size=1&filter=business_size:S"
  },
  {
    "id": "lab-19",
    "citation": "GSA CALC+ Labor Ceiling Rates API (keyword 'management consultant', business_size = O); checker's recomputation, U.S. General Services Administration, Data as of 2026-10-12",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=management%20consultant&page=1&page_size=1&filter=business_size:O"
  },
  {
    "id": "lab-20",
    "citation": "GSA CALC+ Labor Ceiling Rates API (keyword 'business consultant'); checker's recomputation, U.S. General Services Administration, Data as of 2026-10-12",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=business%20consultant&page=1&page_size=1&filter=business_size:S"
  },
  {
    "id": "lab-21",
    "citation": "GSA CALC+ Labor Ceiling Rates API, keyword searches 'mckinsey', 'boston consulting', 'kpmg', 'ernst'; checker's computation, U.S. General Services Administration, Data as of 2026-10-12",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=mckinsey&page=1&page_size=50"
  },
  {
    "id": "lab-22",
    "citation": "Go Fractional, Fractional CFO Cost & Rates live benchmark, Go Fractional (fractional-talent marketplace), 2026 (page updated 2026-10-13 00:17 UTC, 'Last updated October 13, 2026')",
    "url": "https://www.gofractional.com/insights/rates/cfo"
  },
  {
    "id": "lab-23",
    "citation": "Go Fractional, Fractional Controller rate benchmark, Go Fractional, 2026 (page updated 2026-10-13 00:12 UTC)",
    "url": "https://www.gofractional.com/insights/rates/controller"
  },
  {
    "id": "lab-24",
    "citation": "Pilot pricing page, Pilot (outsourced accounting vendor), 2026 (accessed 2026-10-12)",
    "url": "https://pilot.com/pricing"
  },
  {
    "id": "lab-25",
    "citation": "Ignition, 2025 U.S. Accounting and Tax Pricing Benchmark (press release), Ignition (practice-management software vendor), 2025 (released August 21, 2025)",
    "url": "https://www.ignitionapp.com/news/the-end-of-hourly-billing-ignitions-2025-benchmark-signals-pricing-shift-for-firms"
  },
  {
    "id": "time-01",
    "citation": "Dillon, Jaffe, Immorlica & Stanton, 'Shifting Work Patterns with Generative AI', arXiv 2504.11436v4 (13 Nov 2025, the latest version); also NBER Working Paper 33795 (May 2025), arXiv / National Bureau of Economic Research (authors at Microsoft Research and Harvard Business School), 2025",
    "url": "https://arxiv.org/html/2504.11436v4"
  },
  {
    "id": "time-02",
    "citation": "Microsoft Work Trend Index 2023 Annual Report, 'Will AI Fix Work?' (May 9, 2023), footnote 2, Microsoft WorkLab, 2023",
    "url": "https://www.microsoft.com/en-us/worklab/work-trend-index/will-ai-fix-work"
  },
  {
    "id": "time-03",
    "citation": "Microsoft WorkLab, 'Breaking down the infinite workday', Work Trend Index Special Report (June 17, 2025), Microsoft WorkLab, 2025",
    "url": "https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday"
  },
  {
    "id": "time-04",
    "citation": "Adobe 2019 Email Usage Study, reported on the Adobe Blog by Giselle Abramovich (Sept 8, 2019), Adobe, 2019",
    "url": "https://blog.adobe.com/en/publish/2019/09/08/if-you-think-email-is-dead-think-again"
  },
  {
    "id": "time-05",
    "citation": "Asana, Anatomy of Work Global Index 2023, press release (Business Wire, March 8, 2023), as reproduced by StockTitan, Asana (press release via Business Wire), 2023",
    "url": "https://www.stocktitan.net/news/ASAN/asana-anatomy-of-work-global-index-2023-smart-collaboration-and-214zshc2fhdf.html"
  },
  {
    "id": "time-06",
    "citation": "APQC General Accounting Open Standards Benchmarking, reported in CFO.com 'Metric of the Month' (Perry D. Wiggins, March 5, 2018), APQC via CFO.com, 2018 (article date; data-collection period not stated)",
    "url": "https://www.cfo.com/news/metric-of-the-month-cycle-time-for-monthly-close/659297/"
  },
  {
    "id": "time-07",
    "citation": "IRS, 2025 Instructions for Form 1120-S, Paperwork Reduction Act Notice, 'Estimates of Taxpayer Burden', Table 3, Internal Revenue Service, 2025 (tax-year 2025 forms; estimates as of December 2025)",
    "url": "https://www.irs.gov/pub/irs-pdf/i1120s.pdf"
  },
  {
    "id": "time-08",
    "citation": "IRS, 2025 Form 1040 and 1040-SR Instructions, 'Estimated Average Taxpayer Burden for Individuals by Activity', Internal Revenue Service, 2025 (tax-year 2025; estimates as of October 1, 2025)",
    "url": "https://www.irs.gov/pub/irs-pdf/i1040gi.pdf"
  },
  {
    "id": "time-09",
    "citation": "Raymond R. Panko, 'What We Don't Know About Spreadsheet Errors Today: The Facts, Why We Don't Believe Them, and What We Need to Do', EuSpRIG 2015 Proceedings (arXiv 1602.02601), European Spreadsheet Risks Interest Group (EuSpRIG), 2015 (underlying inspections 1995-2001)",
    "url": "https://arxiv.org/pdf/1602.02601"
  },
  {
    "id": "time-10",
    "citation": "Raymond R. Panko, 'Spreadsheet Errors: What We Know. What We Think We Can Do', EuSpRIG Symposium 2000 (arXiv 0802.3457), European Spreadsheet Risks Interest Group (EuSpRIG), 2000",
    "url": "https://arxiv.org/pdf/0802.3457"
  },
  {
    "id": "time-11",
    "citation": "Felienne Hermans & Emerson Murphy-Hill, 'Enron's Spreadsheets and Related Emails: A Dataset and Analysis', TU Delft SERG technical report TUD-SERG-2014-021 (cited by Panko 2015 as Hermans and Murphy-Hill [2015]), Delft University of Technology, Software Engineering Research Group, 2014 (technical report); cited as 2015",
    "url": "https://repository.tudelft.nl/file/File_6407791c-a000-4062-acaf-63e04502dfdc"
  },
  {
    "id": "time-12",
    "citation": "Wells Fargo/Gallup Small Business Index, Gallup News 'Work, Labor, Love: Small-Business Owners' (Aug 23, 2005), Gallup, 2005",
    "url": "https://news.gallup.com/poll/18088/work-labor-love-smallbusiness-owners.aspx"
  },
  {
    "id": "time-13",
    "citation": "Intuit QuickBooks, 2025 Small Business Late Payments Report (May 28, 2025), Intuit QuickBooks, 2025",
    "url": "https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/"
  },
  {
    "id": "time-14",
    "citation": "Intuit QuickBooks mid-size payments research (Wakefield Research), Dec 23, 2021, Intuit QuickBooks, 2021",
    "url": "https://quickbooks.intuit.com/r/midsize-business/midsize-payments-research/"
  },
  {
    "id": "ai-01",
    "citation": "Brynjolfsson, Li & Raymond, 'Generative AI at Work', Quarterly Journal of Economics 140(2):889-942 (May 2025 issue; published online 4 February 2025), Oxford University Press (QJE); earlier version NBER WP 31161, 2025",
    "url": "https://academic.oup.com/qje/article/140/2/889/7990658"
  },
  {
    "id": "ai-02",
    "citation": "Brynjolfsson, Li & Raymond, 'Generative AI at Work', NBER Working Paper 31161 (issued April 2023, revised November 2023), NBER, 2023",
    "url": "https://www.nber.org/papers/w31161"
  },
  {
    "id": "ai-03",
    "citation": "Noy & Zhang, 'Experimental evidence on the productivity effects of generative artificial intelligence', Science 381(6654):187-192 (July 2023), AAAS (Science); abstract verified via the Europe PMC record (PMID 37440646), 2023",
    "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1126/science.adh2586&resultType=core&format=json"
  },
  {
    "id": "ai-04",
    "citation": "Noy & Zhang, Science accepted manuscript (NBER conference copy), NBER (conference copy of the Science manuscript), 2023",
    "url": "https://conference.nber.org/conf_papers/f184551.pdf"
  },
  {
    "id": "ai-05",
    "citation": "Noy & Zhang, 'Experimental Evidence on the Productivity Effects of Generative Artificial Intelligence', MIT working paper (March 10, 2023, not peer reviewed), MIT Department of Economics, 2023",
    "url": "https://economics.mit.edu/sites/default/files/inline-files/Noy_Zhang_1_0.pdf"
  },
  {
    "id": "ai-06",
    "citation": "Dell'Acqua, McFowland, Mollick et al., 'Navigating the Jagged Technological Frontier', Organization Science 37(2):403-423 (March 2026), INFORMS (Organization Science); abstract verified via the Crossref record, 2026",
    "url": "https://api.crossref.org/works/10.1287/orsc.2025.21838"
  },
  {
    "id": "ai-07",
    "citation": "HBS AI Institute, 'Back to the Beginnings of AI at Work' (summary of Dell'Acqua et al.), April 9, 2026, Harvard Business School AI Institute, 2026",
    "url": "https://aiinstitute.hbs.edu/back-to-the-beginnings-of-ai-at-work/"
  },
  {
    "id": "ai-08",
    "citation": "Humlum & Vestergaard, 'Still Waters, Rapid Currents: Early Labor Market Transformation under Generative AI', NBER WP 33777 (May 2025, revised March 2026); previously circulated as 'Large Language Models, Small Labor Market Effects' (BFI WP 2025-56), NBER (revision); University of Chicago Becker Friedman Institute (May 2025 version), 2026",
    "url": "https://www.nber.org/system/files/working_papers/w33777/w33777.pdf"
  },
  {
    "id": "ai-09",
    "citation": "Humlum & Vestergaard, 'Large Language Models, Small Labor Market Effects', BFI WP 2025-56 (May 2025), University of Chicago Becker Friedman Institute, 2025",
    "url": "https://bfi.uchicago.edu/wp-content/uploads/2025/04/BFI_WP_2025-56-3.pdf"
  },
  {
    "id": "ai-10",
    "citation": "Humlum & Vestergaard, 'Still Waters, Rapid Currents: Early Labor Market Transformation under Generative AI', NBER Working Paper 33777 (issued May 2025, revised March 2026), NBER, 2026",
    "url": "https://www.nber.org/papers/w33777"
  },
  {
    "id": "ai-11",
    "citation": "Bick, Blandin & Deming, 'The Rapid Adoption of Generative AI', NBER WP 32966 (issued September 2024, revised February 2025), NBER, 2025",
    "url": "https://www.nber.org/papers/w32966"
  },
  {
    "id": "ai-12",
    "citation": "Bick, Blandin & Deming, 'The Impact of Generative AI on Work Productivity', St. Louis Fed On the Economy (February 27, 2025), Federal Reserve Bank of St. Louis, 2025",
    "url": "https://www.stlouisfed.org/on-the-economy/2025/feb/impact-generative-ai-work-productivity"
  },
  {
    "id": "ai-13",
    "citation": "Bick, Blandin & Deming, 'The State of Generative AI Adoption in 2025', St. Louis Fed On the Economy (November 13, 2025), Federal Reserve Bank of St. Louis, 2025",
    "url": "https://www.stlouisfed.org/on-the-economy/2025/nov/state-generative-ai-adoption-2025"
  },
  {
    "id": "ai-14",
    "citation": "Bick, Blandin & Deming, GenAI Adoption Tracker, GenAI Adoption Tracker (Bick, Blandin & Deming); funded by Walmart and supported in part by the HBS AI Institute, 2026",
    "url": "https://genaiadoptiontracker.com/"
  },
  {
    "id": "ai-15",
    "citation": "Dillon, Jaffe, Immorlica & Stanton, 'Shifting Work Patterns with Generative AI', NBER WP 33795 (May 2025, revised November 2025), NBER, 2025",
    "url": "https://www.nber.org/system/files/working_papers/w33795/w33795.pdf"
  },
  {
    "id": "ai-16",
    "citation": "Dell'Acqua et al., 'The Cybernetic Teammate: A Field Experiment on Generative AI Reshaping Teamwork and Expertise', NBER WP 33641 (April 2025), NBER, 2025",
    "url": "https://www.nber.org/system/files/working_papers/w33641/w33641.pdf"
  },
  {
    "id": "ai-17",
    "citation": "Cui, Demirer, Jaffe, Musolff, Peng & Salz, 'The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers', Management Science (published online 27 February 2026), INFORMS (Management Science); Microsoft Research preprint page, 2026",
    "url": "https://www.microsoft.com/en-us/research/?p=1148213"
  },
  {
    "id": "ai-18",
    "citation": "METR, 'Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity' (July 10, 2025), METR (nonprofit research organization), 2025",
    "url": "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/"
  },
  {
    "id": "ai-19",
    "citation": "Peng, Kalliamvakou, Cihon & Demirer, 'The Impact of AI on Developer Productivity: Evidence from GitHub Copilot', arXiv 2302.06590, arXiv, 2023",
    "url": "https://arxiv.org/abs/2302.06590"
  },
  {
    "id": "ai-20",
    "citation": "Cambon et al., 'Early LLM-based Tools for Enterprise Information Workers Likely Provide Meaningful Boosts to Productivity', Microsoft Research MSR-TR-2023-43 (December 2023), Microsoft Research (vendor), 2023",
    "url": "https://www.microsoft.com/en-us/research/uploads/prod/2023/12/AI-and-Productivity-Report-First-Edition.pdf"
  },
  {
    "id": "ai-21",
    "citation": "UK Department for Business and Trade, 'The Evaluation of the M365 Copilot Pilot in the Department for Business and Trade' (August 2025), Table 5, UK Government (GOV.UK), 2025",
    "url": "https://assets.publishing.service.gov.uk/media/68adbe409e1cebdd2c96a19d/dbt-microsoft-365-copilot-evaluation.pdf"
  },
  {
    "id": "ai-22",
    "citation": "UK Government Digital Service, 'Microsoft 365 Copilot Experiment: Cross-Government Findings Report' (published 2 June 2025), UK Government Digital Service (GOV.UK), 2025",
    "url": "https://www.gov.uk/government/publications/microsoft-365-copilot-experiment-cross-government-findings-report/microsoft-365-copilot-experiment-cross-government-findings-report-html"
  },
  {
    "id": "ai-23",
    "citation": "Fitzpatrick, Kelly, Carey, Walsh & Nugent (Central Bank of Ireland), 'Assessing Generative AI value in a public sector context: evidence from a field experiment', arXiv 2502.09479 (February 2025), arXiv, 2025",
    "url": "https://arxiv.org/abs/2502.09479"
  },
  {
    "id": "ai-24",
    "citation": "Schwarcz, Manning, Barry, Cleveland, Prescott & Rich, 'AI-Powered Lawyering: AI Reasoning Models, Retrieval Augmented Generation, and the Future of Legal Practice', Berkeley Law (paper archive copy), 2025",
    "url": "https://www.law.berkeley.edu/wp-content/uploads/archive/2025/12/AI-Powered-Lawyering.pdf"
  },
  {
    "id": "ai-25",
    "citation": "Choi & Xie, 'Human + AI in Accounting: Early Evidence from the Field' (SSRN working paper, May 2025), as summarized by Stanford GSB Insights, Stanford Graduate School of Business, 2025",
    "url": "https://gsb.stanford.edu/insights/ai-reshaping-accounting-jobs-doing-boring-stuff"
  },
  {
    "id": "ai-26",
    "citation": "Fang, Yuan, Zhang, Donati & Sarvary, 'Generative AI and Sales Productivity: Field Experiments in Online Retail', arXiv 2510.12049 v6 (29 June 2026), arXiv, 2026",
    "url": "https://arxiv.org/html/2510.12049v6"
  },
  {
    "id": "ai-27",
    "citation": "Ju & Aral, 'Collaborating with AI Agents: Field Experiments on Teamwork, Productivity, and Performance', arXiv 2503.18238 v3 (5 February 2026), arXiv (MIT authors), 2026",
    "url": "https://arxiv.org/abs/2503.18238v3"
  },
  {
    "id": "ai-28",
    "citation": "Wang, Zhu, Feng, Lu & Jia, 'Agentic AI and Human-in-the-Loop Interventions: Field Experimental Evidence from Alibaba's Customer Service Operations', arXiv 2605.14830 (May 2026; v2 June 2026), arXiv, 2026",
    "url": "https://arxiv.org/abs/2605.14830"
  },
  {
    "id": "ai-29",
    "citation": "Otis, Clarke, Delecourt, Holtz & Koning, 'The Uneven Impact of Generative Artificial Intelligence on Entrepreneurial Performance: Evidence from a Field Experiment in Kenya', Management Science (published online 10 July 2026), INFORMS (Management Science); abstract verified via the Crossref record, 2026",
    "url": "https://api.crossref.org/works/10.1287/mnsc.2024.06909"
  },
  {
    "id": "ai-30",
    "citation": "Xu et al., 'TheAgentCompany: Benchmarking LLM Agents on Consequential Real World Tasks', arXiv 2412.14161 v3 (10 September 2025), arXiv, 2025",
    "url": "https://arxiv.org/abs/2412.14161"
  },
  {
    "id": "ai-31",
    "citation": "Mazeika et al. (Scale AI & Center for AI Safety), 'Remote Labor Index: Measuring AI Automation of Remote Work', arXiv 2510.26787; CAIS blog update (July 1, 2026), arXiv / Center for AI Safety, 2025 (updated 2026)",
    "url": "https://arxiv.org/abs/2510.26787"
  },
  {
    "id": "ai-32",
    "citation": "Huang et al., 'CRMArena-Pro: Holistic Assessment of LLM Agents Across Diverse Business Scenarios and Interactions', arXiv 2505.18878 (May 2025), arXiv (Salesforce AI Research), 2025",
    "url": "https://arxiv.org/abs/2505.18878"
  },
  {
    "id": "ai-33",
    "citation": "Yotzov, Barrero, Bloom, Bunn, Davis et al., 'Firm Data on AI', NBER WP 34836 (February 2026, revised March 2026), NBER, 2026",
    "url": "https://www.nber.org/papers/w34836"
  },
  {
    "id": "ai-34",
    "citation": "Anthropic, 'Estimating AI productivity gains from Claude conversations' (November 25, 2025), Anthropic (vendor), 2025",
    "url": "https://www.anthropic.com/research/estimating-productivity-gains"
  },
  {
    "id": "ai-35",
    "citation": "Suh & Oh, 'Generative AI and the Reallocation of Time: Productivity, Leisure, and Fulfilling Work', arXiv 2602.12695 (February 13, 2026), arXiv, 2026",
    "url": "https://arxiv.org/abs/2602.12695"
  },
  {
    "id": "ai-36",
    "citation": "Sack, Krayer, Wiles et al. (BCG Henderson Institute), 'GenAI Doesn't Just Increase Productivity. It Expands Capabilities.' (September 5, 2024), Boston Consulting Group (vendor-adjacent), 2024",
    "url": "https://www.bcg.com/publications/2024/gen-ai-increases-productivity-and-expands-capabilities"
  },
  {
    "id": "cx-01",
    "citation": "Klarna press release: 'Klarna AI assistant handles two-thirds of customer service chats in its first month' (Feb 27, 2024), Klarna, 2024",
    "url": "https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/"
  },
  {
    "id": "cx-02",
    "citation": "Entrepreneur, 'Klarna CEO Reverses Course By Hiring More Humans, Not AI' (May 9, 2025), citing Sebastian Siemiatkowski's Bloomberg interview, Entrepreneur, 2025",
    "url": "https://www.entrepreneur.com/business-news/klarna-ceo-reverses-course-by-hiring-more-humans-not-ai/491396"
  },
  {
    "id": "cx-03",
    "citation": "Claude (Anthropic) customer case study: Intercom, Anthropic / Intercom, undated (accessed 2026-10)",
    "url": "https://claude.com/customers/intercom"
  },
  {
    "id": "cx-04",
    "citation": "AWS case study: Intercom and Anthropic, Amazon Web Services, undated (accessed 2026-10)",
    "url": "https://aws.amazon.com/solutions/case-studies/intercom-anthropic/"
  },
  {
    "id": "cx-05",
    "citation": "fin.ai homepage, Intercom, 2026 (accessed 2026-10)",
    "url": "https://fin.ai/"
  },
  {
    "id": "cx-06",
    "citation": "Intercom Help Center: Fin AI Agent outcomes, Intercom, 2026",
    "url": "https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes"
  },
  {
    "id": "cx-07",
    "citation": "Intercom Help Center: Update to Fin performance metrics (Aug 31, 2026), Intercom, 2026",
    "url": "https://www.intercom.com/help/en/articles/15599377-update-to-fin-performance-metrics"
  },
  {
    "id": "cx-08",
    "citation": "Salesforce News: 'Lessons from 500,000 Agentforce Customer Conversations' (Apr 22, 2025), Salesforce, 2025",
    "url": "https://www.salesforce.com/news/stories/agentforce-customer-support-lessons-learned/"
  },
  {
    "id": "cx-09",
    "citation": "SaaStr (Jason Lemkin), reporting Gorgias's public AI Agent Benchmark (article published Oct 6, 2026), SaaStr, 2026",
    "url": "https://saastr.com/how-much-of-your-customer-support-can-ai-really-resolve-the-best-get-about-70-the-median-is-48-heres-the-real-data-from-13-vendors"
  },
  {
    "id": "cx-10",
    "citation": "Same Alibaba field-experiment paper (arXiv 2605.14830), section 3 and Table 1, arXiv working paper, 2026 (data 2024)",
    "url": "https://arxiv.org/pdf/2605.14830"
  },
  {
    "id": "cx-11",
    "citation": "Gartner press release (Aug 19, 2024), Gartner, 2024",
    "url": "https://www.gartner.com/en/newsroom/press-releases/2024-08-19-gartner-survey-finds-only-14-percent-of-customer-service-issues-are-fully-resolved-in-self-service"
  },
  {
    "id": "cx-12",
    "citation": "Gartner press release (Sep 25, 2019): 'Gartner Says Only 9% of Customers Report Solving Their Issues Completely via Self-Service', Gartner, 2019",
    "url": "https://www.gartner.com/en/newsroom/press-releases/2019-09-25-gartner-says-only-9--of-customers-report-solving-thei"
  },
  {
    "id": "cx-13",
    "citation": "Gartner press release (Jan 26, 2026), Gartner, 2026",
    "url": "https://www.gartner.com/en/newsroom/press-releases/2026-01-26-gartner-predicts-genai-cost-per-resolution-for-customer-service-will-exceed-offshore-human-agent-costs-by-2030"
  },
  {
    "id": "cx-14",
    "citation": "Intercom pricing page, Intercom, 2026 (accessed 2026-10)",
    "url": "https://www.intercom.com/pricing"
  },
  {
    "id": "cx-15",
    "citation": "Gorgias pricing page, Gorgias, 2026 (accessed 2026-10)",
    "url": "https://www.gorgias.com/pricing"
  },
  {
    "id": "cx-16",
    "citation": "Gartner press release (July 9, 2024), Gartner, 2024",
    "url": "https://www.gartner.com/en/newsroom/press-releases/2024-07-09-gartner-survey-finds-64-percent-of-customers-would-prefer-that-companies-didnt-use-ai-for-customer-service"
  },
  {
    "id": "cx-17",
    "citation": "Brynjolfsson, Li & Raymond, 'Generative AI at Work', The Quarterly Journal of Economics 140(2): 889-942 (2025); earlier NBER Working Paper 31161, The Quarterly Journal of Economics (Oxford University Press) / NBER, 2025 (working paper 2023)",
    "url": "https://ideas.repec.org/a/oup/qjecon/v140y2025i2p889-942..html"
  },
  {
    "id": "cx-18",
    "citation": "Oldroyd, McElheran & Elkington, 'The Short Life of Online Sales Leads', Harvard Business Review (March 2011), Harvard Business Review, 2011",
    "url": "https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
  },
  {
    "id": "cx-19",
    "citation": "Oldroyd (MIT) & Elkington (InsideSales.com), 'Lead Response Management Study', MarketingSherpa B2B Demand Generation Summit (Oct 16, 2007); PDF copy hosted by mortech.com, InsideSales.com / Dr. James Oldroyd, 2007",
    "url": "https://www.mortech.com/hs-fs/hub/25649/file-13535879-pdf/docs/mit_study.pdf"
  },
  {
    "id": "cx-20",
    "citation": "Hennessey Digital, 2025 Lead Form Response Time Study, Hennessey Digital, 2025",
    "url": "https://hennessey.com/2025-lead-form-response-time-study/"
  },
  {
    "id": "cx-21",
    "citation": "Clio 2024 Legal Trends Report, as summarized by the Illinois Supreme Court Commission on Professionalism (2Civility), 2Civility / Clio, 2024",
    "url": "https://www.2civility.org/2024-clio-legal-trends-report-fixing-the-first-impression-problem-for-law-firms/"
  },
  {
    "id": "cx-22",
    "citation": "CallRail ebook, 'From Conversations to Conversions: How Small Businesses Can Market Smarter' (released January 2025), CallRail, 2025",
    "url": "https://cdn.mediavalet.com/usva/callrail/JkB8rSqaVkm46t9C_UsV-w/1NgQXXeP6k2jMrToyiMhSA/Original/Ebook_From%20Conversations%20to%20Conversions_CallRail.pdf"
  },
  {
    "id": "cx-23",
    "citation": "Invoca Home Services Lead Conversion Benchmarks Report 2026, Invoca, 2026",
    "url": "https://invoca.com/reports/the-invoca-home-services-lead-conversion-benchmarks-report-2026"
  },
  {
    "id": "cx-24",
    "citation": "Invoca Call Conversion Industry Benchmarks Report 2025 (press release, June 10, 2025), Invoca (via Seeking Alpha / PR Newswire), 2025",
    "url": "https://seekingalpha.com/pr/20131959-invoca-releases-definitive-cross-channel-and-cross-industry-buyer-conversion-benchmark-report"
  },
  {
    "id": "cx-25",
    "citation": "ServiceTitan blog: 'Typical call-booking rate for ServiceTitan users? The number might shock you into action' (Oct 25, 2022), ServiceTitan, 2022",
    "url": "https://www.servicetitan.com/blog/data-call-booking-rates"
  },
  {
    "id": "cx-26",
    "citation": "Patient Prism, Dental Patient Access Report (July 2, 2026), Patient Prism, 2026 (data CY2025)",
    "url": "https://www.patientprism.com/report/dental-patient-access-report/"
  },
  {
    "id": "cx-27",
    "citation": "TechTarget Patient Engagement, reporting Zocdoc's inaugural 'What Patients Want' report (Dec 13, 2023), TechTarget / Zocdoc, 2023",
    "url": "https://www.techtarget.com/patientengagement/news/366584263/Zocdoc-Sheds-Light-on-User-Appointment-Scheduling-Trends"
  },
  {
    "id": "cx-28",
    "citation": "HomeAdvisor (Angi) cost guide: AC repair (updated Jun 17, 2026), HomeAdvisor / Angi Inc., 2026",
    "url": "https://www.homeadvisor.com/cost/heating-and-cooling/repair-an-ac-unit/"
  },
  {
    "id": "cx-29",
    "citation": "HomeAdvisor (Angi) cost guide: HVAC repair (updated Jun 19, 2026), HomeAdvisor / Angi Inc., 2026",
    "url": "https://www.homeadvisor.com/cost/heating-and-cooling/repair-an-hvac-system/"
  },
  {
    "id": "cx-30",
    "citation": "HomeAdvisor (Angi) cost guide: Hire a plumber (updated Jun 19, 2026), HomeAdvisor / Angi Inc., 2026",
    "url": "https://www.homeadvisor.com/cost/plumbing/hire-a-plumber/"
  },
  {
    "id": "cx-31",
    "citation": "AHRQ MEPS Statistical Brief #555 (Olaisen & Manski, March 2024), Agency for Healthcare Research and Quality, 2024 (data 2019-2021)",
    "url": "https://meps.ahrq.gov/mepsweb/data_files/publications/st555/stat555.shtml"
  },
  {
    "id": "cx-32",
    "citation": "BLS Occupational Outlook Handbook: Customer Service Representatives, U.S. Bureau of Labor Statistics, 2025",
    "url": "https://www.bls.gov/ooh/office-and-administrative-support/customer-service-representatives.htm"
  },
  {
    "id": "cx-33",
    "citation": "BLS Occupational Outlook Handbook: Receptionists, U.S. Bureau of Labor Statistics, 2025",
    "url": "https://www.bls.gov/ooh/office-and-administrative-support/receptionists.htm"
  },
  {
    "id": "cx-34",
    "citation": "LiveChat Customer Service Report 2019 (PDF), LiveChat (Text Inc.), 2020 (data CY2019)",
    "url": "https://www.livechat.com/wp-content/uploads/2020/02/Customer_Service_Report_LiveChat.pdf"
  },
  {
    "id": "cx-35",
    "citation": "BLS CPI-U series CUUR0000SA0, U.S. Bureau of Labor Statistics, 2026 (accessed)",
    "url": "https://data.bls.gov/timeseries/CUUR0000SA0?output_view=data&include_graphs=false"
  },
  {
    "id": "mkt-01",
    "citation": "WordStream by LocaliQ, Google Ads Benchmarks 2026, WordStream by LocaliQ (USA TODAY Co.), 2026 (campaigns Apr 1, 2025 - Mar 31, 2026; page updated Sep 16, 2026)",
    "url": "https://www.wordstream.com/blog/2026-google-ads-benchmarks"
  },
  {
    "id": "mkt-02",
    "citation": "WordStream by LocaliQ, Google Ads Benchmarks 2025, WordStream by LocaliQ, 2025 (campaigns Apr 1, 2024 - Mar 31, 2025)",
    "url": "https://www.wordstream.com/blog/2025-google-ads-benchmarks"
  },
  {
    "id": "mkt-03",
    "citation": "WordStream by LocaliQ, Facebook Ads Benchmarks 2026, WordStream by LocaliQ, 2026 (campaigns Apr 1, 2025 - Jun 30, 2026; page updated Sep 14, 2026)",
    "url": "https://www.wordstream.com/blog/facebook-ads-benchmarks-2026"
  },
  {
    "id": "mkt-04",
    "citation": "WordStream by LocaliQ, Facebook Ads Benchmarks 2025, WordStream by LocaliQ, 2025 (campaigns Apr 1, 2024 - Jun 30, 2025)",
    "url": "https://www.wordstream.com/blog/facebook-ads-benchmarks-2025"
  },
  {
    "id": "mkt-05",
    "citation": "Triple Whale, Facebook Ad Benchmarks by Industry (Updated 2026 Data), Triple Whale, 2026 (Aug 1, 2025 - Jul 31, 2026)",
    "url": "https://www.triplewhale.com/blog/facebook-ads-benchmarks"
  },
  {
    "id": "mkt-06",
    "citation": "Triple Whale, Google Ads Benchmarks by Industry (Updated 2026 Data), Triple Whale, 2026 (Aug 1, 2025 - Jul 31, 2026)",
    "url": "https://www.triplewhale.com/blog/google-ads-benchmarks"
  },
  {
    "id": "mkt-07",
    "citation": "Triple Whale blog, What Is a Good ROAS?, Triple Whale, 2024",
    "url": "https://www.triplewhale.com/blog/whats-a-good-roas"
  },
  {
    "id": "mkt-08",
    "citation": "Blake, Nosko & Tadelis, 'Consumer Heterogeneity and Paid Search Effectiveness: A Large Scale Field Experiment', Econometrica 83 (2015); NBER WP 20171, NBER / Econometrica, 2015 (WP 2014)",
    "url": "https://www.nber.org/papers/w20171"
  },
  {
    "id": "mkt-09",
    "citation": "Gordon, Zettelmeyer, Bhargava & Chapsky, 'A Comparison of Approaches to Advertising Measurement: Evidence from Big Field Experiments at Facebook' (white paper v1.2, 2016; Marketing Science 2019), Kellogg School of Management / Facebook, 2016 (published 2019)",
    "url": "https://www.kellogg.northwestern.edu/faculty/gordon_b/files/kellogg_fb_whitepaper.pdf"
  },
  {
    "id": "mkt-10",
    "citation": "Gordon, Moakler & Zettelmeyer, 'Close Enough? A Large-Scale Exploration of Non-Experimental Approaches to Advertising Measurement' (arXiv 2201.07055 v2, Oct 2022; published in Marketing Science 42(4):768-793, 2023, doi:10.1287/mksc.2022.1413), arXiv (Kellogg / Meta authors), 2022",
    "url": "https://arxiv.org/abs/2201.07055"
  },
  {
    "id": "mkt-11",
    "citation": "Lewis & Rao, 'The Unfavorable Economics of Measuring the Returns to Advertising', Quarterly Journal of Economics (2015), Oxford University Press / QJE, 2015",
    "url": "https://doi.org/10.1093/qje/qjv023"
  },
  {
    "id": "mkt-12",
    "citation": "Simonov, Nosko & Rao, 'Competition and Crowd-Out for Brand Keywords in Sponsored Search', Marketing Science 37(2) (2018), INFORMS Marketing Science, 2018",
    "url": "https://doi.org/10.1287/mksc.2017.1065"
  },
  {
    "id": "mkt-13",
    "citation": "Kohavi & Thomke, 'The Surprising Power of Online Experiments', Harvard Business Review, Sep-Oct 2017 (reprint R1705E), Harvard Business Review, 2017",
    "url": "https://hbr.org/2017/09/the-surprising-power-of-online-experiments"
  },
  {
    "id": "mkt-14",
    "citation": "Kohavi, Deng & Vermeer, 'A/B Testing Intuition Busters', KDD 2022 (Table 2), ACM SIGKDD, 2022",
    "url": "https://airbnb.tech/wp-content/uploads/sites/19/2025/10/ABTestingIntuitionBusters.pdf"
  },
  {
    "id": "mkt-15",
    "citation": "Optimizely, 'Top 10 takeaways from running 173,000 experiments', Optimizely, 2026",
    "url": "https://www.optimizely.com/field-notes/guides/top-10-takeaways-from-the-experimentation-playbook"
  },
  {
    "id": "mkt-16",
    "citation": "Browne & Swarbrick Jones (Qubit), 'What works in e-commerce - a meta-analysis of 6700 online experiments' (2017), Qubit Digital Ltd (methodology assured by PwC UK), 2017",
    "url": "https://www.gwern.net/doc/economics/advertising/2017-browne.pdf"
  },
  {
    "id": "mkt-17",
    "citation": "Berman & Van den Bulte, 'False Discovery in A/B Testing', Management Science (2022), INFORMS Management Science, 2022",
    "url": "https://doi.org/10.1287/mnsc.2021.4207"
  },
  {
    "id": "mkt-18",
    "citation": "WordStream study as reported by Search Engine Watch, 'Are You Wasting 25% Of Your PPC Budget? New Study Says You Might Be' (Oct 9, 2013), Search Engine Watch (study by WordStream), 2013",
    "url": "https://searchenginewatch.com/2013/10/09/are-you-wasting-25-of-your-ppc-budget-new-study-says-you-might-be/"
  },
  {
    "id": "mkt-19",
    "citation": "Doctor Ads (Igor Ivitskiy), 'How Much of Your Google Ads Budget Is Wasted?', Doctor Ads (PPC consultancy), 2026 (data Sep 2024 - Feb 2025)",
    "url": "https://thedoctorads.com/blog/how-much-google-ads-budget-is-wasted"
  },
  {
    "id": "mkt-20",
    "citation": "Optmyzr, broad match vs exact match and bidding study (Sep 27, 2023), Optmyzr, 2023 (Q1 2023 data)",
    "url": "https://www.optmyzr.com/blog/optmyzr-study-broad-match-bidding/"
  },
  {
    "id": "mkt-21",
    "citation": "Optmyzr, 'Broad Match is Winning the Budget War. Is It Winning on Performance Too?', Optmyzr, 2026 (Feb 2026 data; published May 11, 2026)",
    "url": "https://www.optmyzr.com/blog/google-ads-match-type-performance/"
  },
  {
    "id": "mkt-22",
    "citation": "ANA Programmatic Media Supply Chain Transparency Study (issued December 2023), Association of National Advertisers (ANA), 2023",
    "url": "https://www.ana.net/content/show/id/media-programmatic-transparency"
  },
  {
    "id": "mkt-23",
    "citation": "Chae, Bruno & Feinberg, 'Wearout or Weariness? Measuring Potential Negative Consequences of Online Ad Volume and Placement on Website Visits', Journal of Marketing Research 56(1) (2019), SAGE / American Marketing Association, 2019 (online Dec 2018)",
    "url": "https://doi.org/10.1177/0022243718820587"
  },
  {
    "id": "mkt-24",
    "citation": "Google Ads & Commerce blog, 'Introducing AI Max for Search campaigns' (May 2025), Google, 2025",
    "url": "https://blog.google/products/ads-commerce/google-ai-max-for-search-campaigns/"
  },
  {
    "id": "mkt-25",
    "citation": "Meta Newsroom, 'Introducing New Automation Tools to Increase Sales and Drive Growth' (Aug 2022), Meta, 2022",
    "url": "https://about.fb.com/news/2022/08/introducing-new-automation-tools-to-increase-sales-and-drive-growth/"
  },
  {
    "id": "sales-01",
    "citation": "Hunter, State of Email Outreach 2026 Report, Hunter.io (Hunter Web Services, Inc.), 2026 report (2025 data)",
    "url": "https://hunter.io/the-state-of-cold-email"
  },
  {
    "id": "sales-02",
    "citation": "Hunter, State of Cold Email 2025 Report, Hunter.io, 2025 report (2024 data)",
    "url": "https://hunter.io/the-state-of-cold-email-2025"
  },
  {
    "id": "sales-03",
    "citation": "Instantly, Cold Email Benchmark Report 2026 (updated January 12, 2026), Instantly.ai, 2026 report (2025 data)",
    "url": "https://instantly.ai/cold-email-benchmark-report-2026"
  },
  {
    "id": "sales-04",
    "citation": "Belkins, 'What are B2B cold email response rates? Belkins' 2026 study' (updated 2026-06-26), Belkins (US B2B lead-generation agency), 2026 study (2025 data)",
    "url": "https://belkins.io/blog/cold-email-response-rates"
  },
  {
    "id": "sales-05",
    "citation": "Sales.co, 'Cold Email Response Rates in 2026: The Real Numbers From 1,288,605 Sent Emails' (updated Aug 17, 2026), Sales.co, 2026 (Oct 2025 - Aug 2026 data)",
    "url": "https://sales.co/research/cold-email-response-rates"
  },
  {
    "id": "sales-06",
    "citation": "Sales.co, Cold Email Benchmark Report 2026 / 'Cold Email Statistics (2026)' (published Feb 4, 2026; updated Sep 3, 2026), Sales.co, 2026 (campaigns 2024 - early 2026)",
    "url": "https://sales.co/research/cold-email-statistics"
  },
  {
    "id": "sales-07",
    "citation": "Sales.co, 'Cold email is dying and there is nothing you can do about it', Sales.co, 2026 (published Sep 27, 2026)",
    "url": "https://sales.co/research/cold-email-is-dying"
  },
  {
    "id": "sales-08",
    "citation": "Sales.co, 'Personalization no longer matters for cold email', Sales.co, 2026 (published Sep 27, 2026)",
    "url": "https://sales.co/research/personalization-no-longer-matters"
  },
  {
    "id": "sales-09",
    "citation": "OneAway, 'We Analyzed 1,533,399 Cold Emails. Here's What Actually Gets a Reply in 2026.', OneAway, Published June 2, 2026 (cumulative data as of June 2026; start date not stated)",
    "url": "https://oneaway.io/blog/cold-email-statistics-2026"
  },
  {
    "id": "sales-10",
    "citation": "Sahni, Wheeler & Chintagunta, 'Personalization in Email Marketing: The Role of Non-Informative Advertising Content', Marketing Science 37(2), Stanford GSB (publication page) / INFORMS Marketing Science, 2018 (Feb 27, 2018)",
    "url": "https://www.gsb.stanford.edu/faculty-research/publications/personalization-email-marketing-role-non-informative-advertising"
  },
  {
    "id": "sales-11",
    "citation": "Noy & Zhang, 'Experimental evidence on the productivity effects of generative artificial intelligence', Science (July 2023), doi:10.1126/science.adh2586; abstract via Stanford SCALE, Science (AAAS); MIT, 2023",
    "url": "https://scale.stanford.edu/publications/experimental-evidence-productivity-effects-generative-artificial-intelligence"
  },
  {
    "id": "sales-12",
    "citation": "Google, Email sender guidelines FAQ, Google, Current (checked Oct 2026)",
    "url": "https://support.google.com/mail/answer/14229414"
  },
  {
    "id": "sales-13",
    "citation": "Google, Email sender guidelines (and FAQ), Google, Effective Feb 1, 2024 (current)",
    "url": "https://support.google.com/mail/answer/81126"
  },
  {
    "id": "sales-14",
    "citation": "Yahoo Sender Hub, Best practices, Yahoo, 2024 (current)",
    "url": "https://senders.yahooinc.com/best-practices/"
  },
  {
    "id": "sales-15",
    "citation": "Microsoft Defender for Office 365 blog, 'Strengthening Email Ecosystem: Outlook’s New Requirements for High‐Volume Senders', Microsoft, 2025 (posted Apr 2, 2025; updated Apr 30, 2025)",
    "url": "https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%e2%80%99s-new-requirements-for-high%e2%80%90volume-senders/4399730"
  },
  {
    "id": "sales-16",
    "citation": "FTC, CAN-SPAM Act: A Compliance Guide for Business, Federal Trade Commission, 2025 inflation-adjusted level, unchanged for 2026",
    "url": "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business"
  },
  {
    "id": "sales-17",
    "citation": "FTC notice, Civil Penalty Inflation Adjustments (FR Doc. 2026-18853), Federal Trade Commission, 2026 (filed Sep 14, published Sep 15, 2026)",
    "url": "https://public-inspection.federalregister.gov/2026-18853.pdf"
  },
  {
    "id": "sales-18",
    "citation": "Google Workspace Admin Help, Gmail sending limits in Google Workspace, Google, Current (checked Oct 2026)",
    "url": "https://knowledge.workspace.google.com/admin/gmail/gmail-sending-limits-in-google-workspace"
  },
  {
    "id": "sales-19",
    "citation": "Microsoft Learn, Exchange Online limits, Microsoft, Current (page dated 2026-04-07)",
    "url": "https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits"
  },
  {
    "id": "sales-20",
    "citation": "Salesforce, State of Sales 7th edition (announcement, Feb 3, 2026), Salesforce Research, 2026 (survey Aug-Sep 2025)",
    "url": "https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/"
  },
  {
    "id": "sales-21",
    "citation": "Salesforce, State of Sales 7th edition (report PDF), Salesforce Research, 2026 (survey Aug-Sep 2025)",
    "url": "https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/reports/sales/salesforce-state-of-sales-report-2026.pdf"
  },
  {
    "id": "sales-22",
    "citation": "RevOps Squared and Revenue.io, 2021 Customer Acquisition Benchmarks Report, RevOps Squared / Revenue.io, 2021 report (survey 2020)",
    "url": "https://knowledge.revenue.io/hubfs/Revenue%20Ebooks/revenue-2021-customer-acquisition-benchmarks-report.pdf"
  },
  {
    "id": "sales-23",
    "citation": "Ebsta and Pavilion, 2023 B2B Sales Benchmarks Report, Ebsta, 2023 report (2022 data)",
    "url": "https://www.ebsta.com/wp-content/uploads/2023/02/2023-B2B-Sales-Benchmark-Report.pdf"
  },
  {
    "id": "sales-24",
    "citation": "Ebsta, 2024 B2B Sales Benchmarks: H1 Update, Ebsta, 2024",
    "url": "https://ebsta.com/wp-content/uploads/2024/07/H1-Update-2024-B2B-Sales-Benchmarks.pdf"
  },
  {
    "id": "sales-25",
    "citation": "Loopio, 2025 RFP Response Trends & Benchmarks Report, Loopio, 2025 report (2024 data)",
    "url": "https://link.loopio.com/hubfs/loopio-trends-report-2025-digital.pdf"
  },
  {
    "id": "sales-26",
    "citation": "Kaseya, 2024 MSP Benchmark Survey Report, Kaseya, 2024",
    "url": "https://www.kaseya.com/assets/downloads/resources/Whitepaper-2024-MSP-Benchmark-Survey_Kaseya.pdf"
  },
  {
    "id": "sales-27",
    "citation": "ISSA, 'Commercial Cleaning Rates per Square Foot: Full Pricing Guide' (ISSA Staff), ISSA (worldwide cleaning industry association), 2025 (Dec 4, 2025)",
    "url": "https://www.issa.com/articles/commercial-cleaning-rates-per-square-foot/"
  },
  {
    "id": "sales-28",
    "citation": "HomeAdvisor, 'How Much Does Commercial Cleaning Cost in 2026?', HomeAdvisor (Angi), 2026 (updated Jun 20, 2026)",
    "url": "https://www.homeadvisor.com/cost/cleaning-services/commercial-cleaning-rates/"
  },
  {
    "id": "pnl-01",
    "citation": "Marn, Roegner and Zawada, 'The power of pricing', The McKinsey Quarterly 2003 Number 1, Exhibit 1 'The power of one', McKinsey & Company (The McKinsey Quarterly); PDF copy hosted on a University of Colorado faculty course page, 2003",
    "url": "https://leeds-faculty.colorado.edu/ysun/MKTG4825_files/The%20Power%20of%20Pricing-1.pdf"
  },
  {
    "id": "pnl-02",
    "citation": "Clio, Legal Trends Report, 'Law Firm KPIs / Key Performance Indicators & Benchmarks' page (2025 figures), Clio (Themis Solutions Inc.), 2025",
    "url": "https://www.clio.com/resources/legal-trends/benchmarks/"
  },
  {
    "id": "pnl-03",
    "citation": "Joan Feldman, 'Small Firm Hourly Rates by State and Practice Area', Attorney at Work (summary of the Clio 2024 Legal Trends Report), Attorney at Work (secondary summary of Clio data), 2024 (article dated 2024-10-23)",
    "url": "https://www.attorneyatwork.com/solo-and-small-firm-lawyer-hourly-rates/"
  },
  {
    "id": "pnl-04",
    "citation": "Zylo 2026 SaaS Management Index (report page), Zylo license-waste solution page and Zylo 'SaaS statistics' blog, Zylo (SaaS management software vendor), 2026 (2025 data)",
    "url": "https://zylo.com/reports/2026-saas-management-index/"
  },
  {
    "id": "pnl-05",
    "citation": "Help Net Security, '53% of SaaS licenses remain unused' (reporting Productiv's 2023 State of SaaS data), Help Net Security, reporting Productiv (SaaS management vendor) data, 2023 (article dated July 4, 2023)",
    "url": "https://www.helpnetsecurity.com/2023/07/04/saas-spend-management/"
  },
  {
    "id": "pnl-06",
    "citation": "Annual Wholesale Trade Survey 2022, Table 4: Estimated Annual Purchases, Gross Margins, and Gross Margins as a Percent of Sales for U.S. Merchant Wholesalers, Except Manufacturers' Sales Branches and Offices: 1992 Through 2022, U.S. Census Bureau, 2022 data (disclosure review CBDRB-FY24-0052, so released in fiscal 2024)",
    "url": "https://www2.census.gov/programs-surveys/awts/tables/2022/2022_awts_purchmarg_nomsbo_table4.xlsx"
  },
  {
    "id": "pnl-07",
    "citation": "Annual Wholesale Trade Survey 2022, Table 5: Estimated Annual Operating Expenses and Operating Expenses as a Percent of Sales for U.S. Merchant Wholesalers: 2002 through 2022, U.S. Census Bureau, 2022 data",
    "url": "https://www2.census.gov/programs-surveys/awts/tables/2022/2022_awts_opex_table5.xlsx"
  },
  {
    "id": "pnl-08",
    "citation": "Quarterly Financial Report for Manufacturing, Mining, Trade, and Selected Service Industries, 2026 Quarter 2 (QFR/26-Q2), Table D -- Profits per Dollar of Sales, U.S. Census Bureau, 2026 (issued September 2026)",
    "url": "https://www.census.gov/econ/qfr/mmws/current/qfr_pub.pdf"
  },
  {
    "id": "pnl-09",
    "citation": "Annual Retail Trade Survey 2022: Estimated Annual Gross Margin as a Percentage of Sales of U.S. Retail Firms by Kind of Business: 1993-2022 (gmper.xlsx); Estimated Annual Operating Expenses (exp.xlsx); Estimated Annual Sales (sales.xlsx), U.S. Census Bureau, 2022 data",
    "url": "https://www2.census.gov/programs-surveys/arts/tables/2022/gmper.xlsx"
  },
  {
    "id": "pnl-10",
    "citation": "ADA Health Policy Institute, 'Income, gross billings, expenses, characteristics, selected staff wages: selected 2025 results from the Survey of Dental Practice' (XLSX), Tables 5 and 13, American Dental Association, Health Policy Institute, 2026 (2025 data)",
    "url": "https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/hpidata_sdpi_2025.xlsx"
  },
  {
    "id": "pnl-11",
    "citation": "National Restaurant Association, 2025 Restaurant Operations Data Abstract (2024 data), summarized in 'Restaurant operators kept food cost ratios in check in 2024', National Restaurant Association, 2025 edition, 2024 data (article dated September 10, 2025)",
    "url": "https://restaurant.org/research-and-media/research/restaurant-economic-insights/analysis-commentary/restaurant-operators-kept-food-cost-ratios-in-check-in-2024/"
  },
  {
    "id": "pnl-12",
    "citation": "National Restaurant Association, 2025 Restaurant Operations Data Abstract, summarized in 'Elevated labor costs had a significant impact on restaurant profitability in 2024', National Restaurant Association, 2025 edition, 2024 data (article dated October 8, 2025)",
    "url": "https://restaurant.org/research-and-media/research/restaurant-economic-insights/analysis-commentary/elevated-labor-costs-had-a-significant-impact-on-restaurant-profitability-in-2024/"
  },
  {
    "id": "pnl-13",
    "citation": "National Restaurant Association press release, 'New resource from National Restaurant Association provides insights into operational realities' (2025 Restaurant Operations Data Abstract), National Restaurant Association, 2025 (press release dated August 20, 2025; 2024 data)",
    "url": "https://restaurant.org/research-and-media/media/press-releases/new-resource-from-national-restaurant-association-provides-insights-into-operational-realities/"
  },
  {
    "id": "pnl-14",
    "citation": "ReFED Fact Sheet, 'Food Waste by Sector: Foodservice', ReFED (nonprofit), 2024 data",
    "url": "https://refed.org/uploads/by-sector-foodservice-1.pdf"
  },
  {
    "id": "pnl-15",
    "citation": "Clowes, Hanson and Swannell, 'The Business Case for Reducing Food Loss and Waste: Restaurants', a report on behalf of Champions 12.3 (WRI and WRAP), Champions 12.3 / World Resources Institute / WRAP, 2019 (February 2019)",
    "url": "https://champions123.org/sites/default/files/2020-07/the-business-case-reducing-food-loss-and-waste-restaurants.pdf"
  },
  {
    "id": "pnl-16",
    "citation": "IRS Statistics of Income, Corporation Complete Report, Table 5.1: Returns of Active Corporations, Balance Sheet, Income Statement, Tax, and Selected Other Items, by Minor Industry, Tax Year 2022, Internal Revenue Service, Statistics of Income Division, Tax year 2022",
    "url": "https://www.irs.gov/pub/irs-soi/22co51ccr.xlsx"
  },
  {
    "id": "pnl-17",
    "citation": "GAO-13-417, 'Strategic Sourcing: Leading Commercial Practices Can Help Federal Agencies Increase Savings When Acquiring Services', U.S. Government Accountability Office, 2013 (published April 15, 2013; publicly released May 15, 2013)",
    "url": "https://www.gao.gov/products/GAO-13-417"
  },
  {
    "id": "pnl-18",
    "citation": "Matthew Grennan and Ashley Swanson, 'Transparency and Negotiated Prices: The Value of Information in Hospital-Supplier Bargaining', NBER Working Paper 22039 (2016); Journal of Political Economy 128(4), 2020, pp. 1234-1268, NBER / Journal of Political Economy, 2020 (working paper February 2016)",
    "url": "https://www.nber.org/papers/w22039"
  },
  {
    "id": "pnl-19",
    "citation": "Katrina Mullen, 'Should Credit Card Fees Be Regulated?', Econ Focus, Fourth Quarter 2025, Policy Update, Federal Reserve Bank of Richmond, 2025",
    "url": "https://www.richmondfed.org/-/media/RichmondFedOrg/publications/research/econ_focus/2025/q4/policy_update.pdf"
  },
  {
    "id": "pnl-20",
    "citation": "Visa USA Interchange Reimbursement Fees (Visa Public), rates effective April 18, 2026, Visa U.S.A., 2026",
    "url": "https://usa.visa.com/content/dam/VCOM/download/merchants/visa-usa-interchange-reimbursement-fees.pdf"
  },
  {
    "id": "pnl-21",
    "citation": "Federal Reserve Board, Regulation II, 'Average Debit Card Interchange Fee by Payment Card Network' (data revised June 10, 2025), Board of Governors of the Federal Reserve System, 2024 data (page last updated December 19, 2025)",
    "url": "https://www.federalreserve.gov/paymentsystems/regii-average-interchange-fee.htm"
  },
  {
    "id": "pnl-22",
    "citation": "Crowe, Mills, Poeling, Curtin, Bjornskov, Fischer and Granderson, 'Building Commissioning Costs and Savings Across Three Decades and 1,500 North American Buildings', Energy and Buildings 227, 2020, Lawrence Berkeley National Laboratory / Energy and Buildings (peer-reviewed), 2020",
    "url": "https://eta-publications.lbl.gov/publications/building-commissioning-costs-and"
  },
  {
    "id": "pnl-23",
    "citation": "U.S. EPA DataTrends: Benchmarking and Energy Savings, as summarized by the Institute for Market Transformation, U.S. Environmental Protection Agency (via IMT), 2012 (IMT post dated October 11, 2012)",
    "url": "https://imt.org/epa-analysis-shows-big-benchmarking-savings/"
  },
  {
    "id": "pnl-24",
    "citation": "Supply Chain Digest summary of the CSCMP/Kearney 2026 State of Logistics Report; U.S. Census Bureau, Manufacturing and Trade Inventories and Sales, July 2026 (release CB26-154, September 16, 2026), CSCMP / Kearney (via Supply Chain Digest); U.S. Census Bureau, 2026",
    "url": "https://www.census.gov/mtis/www/data/pdf/mtis_current.pdf"
  },
  {
    "id": "pnl-25",
    "citation": "Kesavan, Lambert, Williams and Pendem, 'Doing Well by Doing Good: Improving Retail Store Performance with Responsible Scheduling Practices at the Gap, Inc.', Management Science 68(11), 2022, pp. 7818-7836 (abstract via RePEc); Williams et al., 2018 Stable Scheduling Study report, Management Science (INFORMS), peer-reviewed; University of Chicago / UC Hastings WorkLife Law (report), 2022 (report 2018)",
    "url": "https://ideas.repec.org/a/inm/ormnsc/v68y2022i11p7818-7836.html"
  },
  {
    "id": "pnl-26",
    "citation": "BLS CES series CEU3133200009 (average weekly overtime hours, production and nonsupervisory employees, fabricated metal product manufacturing) and CEU3133200007 (average weekly hours); BLS ECEC series CMU2103000000000D/P (overtime and premium, manufacturing) and CMU2023000000000D (wages and salaries, manufacturing), U.S. Bureau of Labor Statistics, 2026",
    "url": "https://data.bls.gov/timeseries/CEU3133200009"
  },
  {
    "id": "pnl-27",
    "citation": "Chad Hemenway, Insurance Journal, reporting the CIAB Q2 2026 P/C Market Survey, Insurance Journal, reporting The Council of Insurance Agents & Brokers, 2026 (article dated August 20, 2026)",
    "url": "https://www.insurancejournal.com/news/national/2026/08/20/882240.htm"
  },
  {
    "id": "pnl-28",
    "citation": "BLS PPI series PCU484121484121, 'PPI industry data for General freight trucking, long-distance TL, not seasonally adjusted', U.S. Bureau of Labor Statistics, 2026",
    "url": "https://data.bls.gov/timeseries/PCU484121484121"
  },
  {
    "id": "pnl-29",
    "citation": "BLS PPI series WPU1017 (Metals and metal products - Steel mill products) and PCU332312332312 (Fabricated structural metal mfg), U.S. Bureau of Labor Statistics, 2026",
    "url": "https://data.bls.gov/timeseries/WPU1017"
  },
  {
    "id": "pnl-30",
    "citation": "Michael V. Marn and Robert L. Rosiello, 'Managing Price, Gaining Profit', Harvard Business Review, September-October 1992, Exhibit 1, Harvard Business Review (authors from McKinsey & Company); PDF copy hosted on a UNC Charlotte course page, 1992",
    "url": "https://pages.charlotte.edu/wp-content/uploads/sites/868/2014/12/ManagingPrice.pdf"
  },
  {
    "id": "pnl-31",
    "citation": "National Retail Federation and Happy Returns, 2025 Retail Returns Landscape (press release), National Retail Federation / Happy Returns (a UPS company), 2025 (press release dated October 15, 2025)",
    "url": "https://nrf.com/media-center/press-releases/consumers-expected-to-return-nearly-850-billion-in-merchandise-in-2025"
  },
  {
    "id": "cons-01",
    "citation": "GSA CALC+ Labor Ceiling Rates API v3, queries re-run 2026-10-12, U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?filter=price_range:499.99,100000&ordering=current_price&sort=desc&page_size=5"
  },
  {
    "id": "cons-02",
    "citation": "GSA CALC+ API, keyword 'McKinsey' (all records downloaded 2026-10-12), U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=McKinsey&page=1&page_size=100"
  },
  {
    "id": "cons-03",
    "citation": "GSA CALC+ API, keyword 'Boston Consulting', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=Boston%20Consulting&page=1&page_size=100"
  },
  {
    "id": "cons-04",
    "citation": "GSA CALC+ API, keyword 'Deloitte', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=Deloitte&page=1&page_size=500"
  },
  {
    "id": "cons-05",
    "citation": "GSA CALC+ API, keyword 'Accenture', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=Accenture&page=1&page_size=500"
  },
  {
    "id": "cons-06",
    "citation": "GSA CALC+ API, keyword 'Ernst', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=Ernst&page=1&page_size=100"
  },
  {
    "id": "cons-07",
    "citation": "GSA CALC+ API, keyword 'KPMG', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=KPMG&page=1&page_size=100"
  },
  {
    "id": "cons-08",
    "citation": "GSA CALC+ API, keyword 'Booz Allen', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=Booz%20Allen&page=1&page_size=500"
  },
  {
    "id": "cons-09",
    "citation": "GSA CALC+ API, keyword 'FTI Consulting', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=FTI%20Consulting&page=1&page_size=100"
  },
  {
    "id": "cons-10",
    "citation": "GSA CALC+ API, keyword 'Alvarez', U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=Alvarez&page=1&page_size=100"
  },
  {
    "id": "cons-11",
    "citation": "GSA CALC+ API, keyword 'management consultant', filter business_size S / O; full download filtered on labor_category, U.S. General Services Administration, 2026 (data as of 2026-10-12)",
    "url": "https://api.gsa.gov/acquisition/calc/v3/api/ceilingrates/?keyword=management%20consultant&filter=business_size:S&page_size=1"
  },
  {
    "id": "cons-12",
    "citation": "NYS OGS Award 23269 Attachment 1 - Pricing, McKinsey & Company, Inc (last updated 6/16/2025), New York State Office of General Services, 2025",
    "url": "https://online.ogs.ny.gov/purchase/snt/awardnotes/7360023269PL_McKinsey.pdf"
  },
  {
    "id": "cons-13",
    "citation": "NYS OGS Award 23269 Attachment 1 - Pricing, The Boston Consulting Group, Inc. (last updated 6/16/2025), New York State Office of General Services, 2025",
    "url": "https://online.ogs.ny.gov/purchase/snt/awardnotes/7360023269PL_BostonConsulting.pdf"
  },
  {
    "id": "cons-14",
    "citation": "NYS OGS Award 23269 Attachment 1 - Pricing, KPMG LLP (last updated 10/7/2025), New York State Office of General Services, 2025",
    "url": "https://online.ogs.ny.gov/purchase/snt/awardnotes/7360023269PL_KPMG.pdf"
  },
  {
    "id": "cons-15",
    "citation": "NYS OGS Award 23269 Attachment 1 - Pricing, Ernst & Young LLP (last updated 6/16/2025), New York State Office of General Services, 2025",
    "url": "https://online.ogs.ny.gov/purchase/snt/awardnotes/7360023269PL_ErnstYoung.pdf"
  },
  {
    "id": "cons-16",
    "citation": "NYS OGS Award 23269 Attachment 1 - Pricing (Deloitte Consulting LLP; Accenture LLP), New York State Office of General Services, 2025-2026",
    "url": "https://online.ogs.ny.gov/purchase/snt/awardnotes/7360023269PL_Deloitte.pdf"
  },
  {
    "id": "cons-17",
    "citation": "Debtors' application to employ Alvarez & Marsal North America, LLC and designate Matthew E. Kvarda as CRO (Doc 34), U.S. Bankruptcy Court, E.D. Missouri (via CourtListener RECAP), 2025",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.moeb.462637/gov.uscourts.moeb.462637.34.0.pdf"
  },
  {
    "id": "cons-18",
    "citation": "Application of the Official Committee of Unsecured Creditors to retain FTI Consulting, Inc. as financial advisor (Doc 385), U.S. Bankruptcy Court, E.D. Missouri (via CourtListener RECAP), 2025",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.moeb.462637/gov.uscourts.moeb.462637.385.0_2.pdf"
  },
  {
    "id": "cons-19",
    "citation": "Debtors' application to employ AlixPartners, LLP as financial advisor (Doc 206), U.S. Bankruptcy Court, D. Delaware (via CourtListener RECAP), 2024",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.deb.194105/gov.uscourts.deb.194105.206.0.pdf"
  },
  {
    "id": "cons-20",
    "citation": "First interim fee application of Alvarez & Marsal North America, LLC (Doc 2571), U.S. Bankruptcy Court, D. New Jersey (via CourtListener RECAP), 2025",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.njb.1126059/gov.uscourts.njb.1126059.2571.0.pdf"
  },
  {
    "id": "cons-21",
    "citation": "Application to employ Weaver and Tidwell, L.L.P. as financial advisor for the Official Committee of Unsecured Creditors (Doc 168), U.S. Bankruptcy Court, D. Minnesota (via CourtListener RECAP), 2026",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.mnb.514197/gov.uscourts.mnb.514197.168.0.pdf"
  },
  {
    "id": "cons-22",
    "citation": "Application to retain Harney Partners as financial advisors to the Debtors (Doc 68), U.S. Bankruptcy Court, N.D. Texas (via CourtListener RECAP), 2026",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.txnb.541113/gov.uscourts.txnb.541113.68.0.pdf"
  },
  {
    "id": "cons-23",
    "citation": "Amended application to employ Accordion Partners, LLC as financial advisor, Exhibit B (Declaration of Melissa S. Kibler), U.S. Bankruptcy Court, M.D. Florida (via CourtListener RECAP), 2026",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.flmb.1436124/gov.uscourts.flmb.1436124.229.2.pdf"
  },
  {
    "id": "cons-24",
    "citation": "Declaration of Lauren P. Berret in support of application to employ her as Chief Restructuring Officer (Doc 8-1), U.S. Bankruptcy Court, D.D.C. (via CourtListener RECAP), 2026",
    "url": "https://storage.courtlistener.com/recap/gov.uscourts.dcb.51381/gov.uscourts.dcb.51381.8.1.pdf"
  },
  {
    "id": "cons-25",
    "citation": "McKinsey & Company, National Cooperative Purchasing Alliance 'Strategic Management Consulting' price quotation, Exhibit 4: McKinsey team bundle rates, McKinsey & Company (document hosted by Ohio procurement, procure.ohio.gov price lists), 2021 (Year 1 prices)",
    "url": "https://dam.assets.ohio.gov/image/upload/procure.ohio.gov/pricelist/RS901320McKinseypricelist.pdf"
  },
  {
    "id": "cons-26",
    "citation": "Austin Jenkins, '$165K a week for COVID analysis: That's how much WA paid a global consulting firm', Northwest News Network, Aug 10, 2020, Northwest News Network (public radio), 2020",
    "url": "https://www.nwnewsnetwork.org/government-and-politics/2020-08-10/165k-a-week-for-covid-analysis-thats-how-much-wa-paid-a-global-consulting-firm"
  },
  {
    "id": "cons-27",
    "citation": "Arkansas Department of Transformation and Shared Services news release, Feb 9, 2024, State of Arkansas, 2024",
    "url": "https://sas.arkansas.gov/news/arkansas-awards-washington-d-c-agency-5-5m-contract-to-assist-states-executive-branch-agencies-with-efficiency/"
  },
  {
    "id": "cons-28",
    "citation": "Houston Chronicle reporting as quoted by Off the Kuff (Charles Kuffner, Mar 31, 2025); scope from Community Impact (Kevin Vu, Feb 12, 2025), Houston Chronicle (via Off the Kuff); Community Impact, 2025",
    "url": "https://offthekuff.com/wp/?p=118259"
  },
  {
    "id": "cons-29",
    "citation": "Nick Castele, 'Cleveland to hire Ernst & Young to audit how City Hall works', Signal Cleveland, Apr 17, 2023, Signal Cleveland, 2023",
    "url": "https://signalcleveland.org/cleveland-to-hire-ernst-young-to-audit-how-city-hall-works/"
  },
  {
    "id": "cons-30",
    "citation": "Rod McGuirk, 'Deloitte to partially refund Australian government for report with apparent AI-generated errors', Associated Press, Oct 7, 2025 (KSAT syndication), Associated Press, 2025",
    "url": "https://www.ksat.com/business/2025/10/07/deloitte-to-partially-refund-australian-government-for-report-with-apparent-ai-generated-errors/"
  },
  {
    "id": "cons-31",
    "citation": "Minutes of the Ogden City Council regular meeting, Dec 16, 2025, Ogden City Council (Utah Public Notice Website), 2025",
    "url": "https://www.utah.gov/pmn/files/1393763.pdf"
  },
  {
    "id": "cons-32",
    "citation": "Stephi Smith, 'Consultant recommends Jefferson City establish grants department', News Tribune, Aug 16, 2024, Jefferson City News Tribune, 2024",
    "url": "https://www.newstribune.com/news/2024/aug/16/consultant-recommends-jefferson-city-establish-grants-department/"
  },
  {
    "id": "cons-33",
    "citation": "'Village Considers Hiring Consultants to Conduct an Organizational Evaluation of the Assessor's Office', Scarsdale10583, Mar 1, 2017, Scarsdale10583 (local news), 2017",
    "url": "https://scarsdale10583.com/section-table/101-village-voices/6016-village-considers-hiring-consultants-to-conduct-an-organizational-evaluation-of-the-assessor-s-office"
  },
  {
    "id": "cons-34",
    "citation": "Workplace Strategy Consulting proposal, Waterbury Select Board meeting packet (May 2026), Town of Waterbury, Vermont, 2026",
    "url": "https://www.waterburyvt.com/fileadmin/files/Elected_Boards/Town_Select_Board/Meetings/2026/05/20260330_Anne_Levesque__Workplace_Strategy_Consulting_-_proposal.pdf"
  },
  {
    "id": "cons-35",
    "citation": "2024 CPA.com & AICPA PCPS Client Advisory Services Benchmark Survey, Appendix B, CPA.com and AICPA Private Companies Practice Section, 2024",
    "url": "https://www.cpa.com/sites/cpa/files/2024-12/2024-CAS-Benchmark-Survey.pdf"
  },
  {
    "id": "cons-36",
    "citation": "Go Fractional, 'Fractional COO Cost & Rates', Go Fractional (fractional-talent marketplace), 2026",
    "url": "https://www.gofractional.com/insights/rates/coo"
  },
  {
    "id": "cons-37",
    "citation": "Riverside County Board of Supervisors, Item 3.12, June 9, 2026, with Amendment No. 1, County of Riverside, California, 2026",
    "url": "https://media.rivcocob.org/proceeds/2026/p2026_06_09_files/03.12001.pdf"
  },
  {
    "id": "cons-38",
    "citation": "K. Michelle Moran, 'Grosse Pointe Park hopes to find cost savings through utilities review', C&G Newspapers, Feb 25, 2026, C&G Newspapers, 2026",
    "url": "https://www.candgnews.com/articles/uncategorized/grosse-pointe-park-hopes-to-find-cost-savings-through-utilities-review/"
  },
  {
    "id": "cons-39",
    "citation": "Cost and Revenue Review Agreement, NYCOM USA Program (rev. 09-30-2024), Village of Croton-on-Hudson, NY (meeting attachment, Nov 2024), 2024",
    "url": "https://play.champds.com/ATT/crotononhudsonny/2024-11/eb34ed4002dbb207d98e7cad91d0fe969fc5e135.pdf"
  },
  {
    "id": "cons-40",
    "citation": "Schooley Mitchell, 'Cost Reduction Overview' (2019), Schooley Mitchell (vendor), 2019",
    "url": "https://www.pgaofalberta.com/uploads/source/Sponsors/Documents/schooley_mitchell_cost_reduction_overview_all_services_2019.pdf"
  },
  {
    "id": "cons-41",
    "citation": "America's SBDC, 'About Us', America's SBDC (Association of Small Business Development Centers), 2026 (page checked Oct 12, 2026)",
    "url": "https://americassbdc.org/about-us/"
  },
  {
    "id": "cons-42",
    "citation": "McKinsey & Company, 'Rewiring the way McKinsey works with Lilli', McKinsey & Company, 2025-2026",
    "url": "https://www.mckinsey.com/capabilities/tech-and-ai/how-we-help-clients/rewiring-the-way-mckinsey-works-with-lilli"
  },
  {
    "id": "cons-43",
    "citation": "Polly Thompson, Business Insider, Nov 17, 2025 ('AI is reshaping how McKinsey makes money', syndicated on Yahoo Finance), Business Insider, 2025",
    "url": "https://finance.yahoo.com/news/ai-reshaping-mckinsey-makes-money-195132745.html"
  },
  {
    "id": "cons-44",
    "citation": "Boussioux, Lane, Zhang, Jacimovic & Lakhani, 'The Crowdless Future? Generative AI and Creative Problem-Solving', Organization Science 35(5):1589-1607 (2024); cost and time figures from the Nov 2023 working-paper version, INFORMS Organization Science; working paper hosted by Boston University Digital Business Institute, 2024",
    "url": "https://bu.edu/dbi/files/2023/11/Crowdless_Future_111323_Digital_BU.pdf"
  },
  {
    "id": "cons-45",
    "citation": "Doshi, Bell, Mirzayev & Vanneste, 'Generative artificial intelligence and evaluating strategic decisions', Strategic Management Journal 46(3):583-610 (2025), Strategic Management Journal (Wiley), 2025",
    "url": "https://ideas.repec.org/a/bla/stratm/v46y2025i3p583-610.html"
  }
];

const byId = new Map(sources.map((s) => [s.id, s]));

export function getSource(id: string): Source | undefined {
  return byId.get(id);
}
