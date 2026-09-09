import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const aiDir = path.resolve(__dirname, '../../../ai');

// Load AI models
const CertificateIntelligenceModel = require(path.join(aiDir, 'CertificateIntelligenceModel.js'));
const CertificateFrontendAdapter   = require(path.join(aiDir, 'CertificateFrontendAdapter.js'));
const CareerPathRecommenderModel    = require(path.join(aiDir, 'CareerPathRecommenderModel.js'));
const WeeklyAnalysisModel           = require(path.join(aiDir, 'WeeklyAnalysisModel.js'));
const AIPortfolioGeneratorModel    = require(path.join(aiDir, 'AIPortfolioGeneratorModel.js'));
const AIPortfolioPDFGenerator      = require(path.join(aiDir, 'AIPortfolioPDFGenerator.js'));
const RecommendationEngine        = require(path.join(aiDir, 'RecommendationEngine.js'));
const RoadmapTaxonomy              = require(path.join(aiDir, 'roadmapTaxonomy.js'));
const OllamaService                = require(path.join(aiDir, 'OllamaService.js'));

// Instantiate singletons
export const certIntelligenceModel = new CertificateIntelligenceModel();
export const certFrontendAdapter   = new CertificateFrontendAdapter();
export const careerRecommenderModel = new CareerPathRecommenderModel();
export const weeklyAnalysisModel   = new WeeklyAnalysisModel();
export const portfolioGenerator    = new AIPortfolioGeneratorModel();
export const portfolioPdfGen       = new AIPortfolioPDFGenerator();
export const recommendationEngine  = new RecommendationEngine();
export const roadmapTaxonomy       = new RoadmapTaxonomy();
export const ollamaService         = new OllamaService();

export {
  CertificateIntelligenceModel,
  CertificateFrontendAdapter,
  CareerPathRecommenderModel,
  WeeklyAnalysisModel,
  AIPortfolioGeneratorModel,
  AIPortfolioPDFGenerator,
  RecommendationEngine,
  RoadmapTaxonomy,
  OllamaService,
};
