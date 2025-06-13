const Peptide = require('../models/Peptide');
const Effect = require('../models/Effect');

class SeedService {
  /**
   * Seeds the database with initial peptide data
   * @returns {Promise<Object>} Result of seeding operation
   */
  static async seedPeptides() {
    try {
      // Check if peptides already exist
      const existingPeptides = await Peptide.countDocuments();
      if (existingPeptides > 0) {
        return {
          success: true,
          message: 'Peptides already exist in database',
          count: existingPeptides
        };
      }

      const initialPeptides = [
        {
          name: 'BPC-157',
          category: 'Healing & Recovery',
          description: 'Body protection compound known for healing properties',
          detailedDescription: 'BPC-157 is a pentadecapeptide derived from human gastric juice. It has shown remarkable healing properties in numerous studies, particularly for gastrointestinal issues, muscle and tendon injuries, and wound healing.',
          mechanism: 'Works by promoting angiogenesis, accelerating wound healing, and protecting organs from damage through multiple pathways including the activation of growth factors.',
          commonDosage: '250-500 mcg',
          commonFrequency: 'Daily',
          averageRating: 4.5,
          totalExperiences: 234,
          commonEffects: ['Faster healing', 'Reduced inflammation', 'Better recovery', 'Improved gut health'],
          sideEffects: ['Mild injection site irritation', 'Temporary fatigue'],
          popularity: 95,
          commonStacks: ['TB-500', 'Ipamorelin'],
          dosageRanges: {
            low: '200-300 mcg',
            medium: '300-500 mcg',
            high: '500-750 mcg'
          },
          timeline: {
            onset: '1-3 days',
            peak: '1-2 weeks',
            duration: '2-4 weeks post-cycle'
          }
        },
        {
          name: 'TB-500',
          category: 'Healing & Recovery',
          description: 'Thymosin Beta-4 fragment for tissue repair',
          detailedDescription: 'TB-500 is a synthetic fraction of the protein thymosin beta-4, which is present in virtually all human and animal cells. It plays an important role in healing and recovery.',
          mechanism: 'Promotes cell migration, angiogenesis, and wound healing by regulating actin, a protein that forms the cytoskeleton of cells.',
          commonDosage: '2-5 mg',
          commonFrequency: 'Twice weekly',
          averageRating: 4.2,
          totalExperiences: 156,
          commonEffects: ['Improved flexibility', 'Tissue repair', 'Reduced pain', 'Enhanced recovery'],
          sideEffects: ['Headaches', 'Nausea', 'Lethargy'],
          popularity: 78,
          commonStacks: ['BPC-157', 'CJC-1295'],
          dosageRanges: {
            low: '2-3 mg',
            medium: '3-5 mg',
            high: '5-7 mg'
          },
          timeline: {
            onset: '3-7 days',
            peak: '2-3 weeks',
            duration: '3-5 weeks post-cycle'
          }
        },
        {
          name: 'Ipamorelin',
          category: 'Growth Hormone',
          description: 'GHRP that stimulates growth hormone release',
          detailedDescription: 'Ipamorelin is a growth hormone releasing peptide (GHRP) that stimulates the release of growth hormone from the pituitary gland. It is considered one of the safest GHRPs.',
          mechanism: 'Binds to the ghrelin receptor and stimulates the release of growth hormone without significantly affecting cortisol or prolactin levels.',
          commonDosage: '200-300 mcg',
          commonFrequency: '2-3x daily',
          averageRating: 4.3,
          totalExperiences: 189,
          commonEffects: ['Better sleep', 'Muscle growth', 'Fat loss', 'Improved recovery'],
          sideEffects: ['Water retention', 'Increased appetite', 'Numbness in hands'],
          popularity: 88,
          commonStacks: ['CJC-1295', 'MOD-GRF'],
          dosageRanges: {
            low: '100-200 mcg',
            medium: '200-300 mcg',
            high: '300-500 mcg'
          },
          timeline: {
            onset: '1-2 weeks',
            peak: '4-6 weeks',
            duration: '2-3 weeks post-cycle'
          }
        },
        {
          name: 'CJC-1295',
          category: 'Growth Hormone',
          description: 'Growth hormone releasing hormone analog',
          detailedDescription: 'CJC-1295 is a synthetic analog of growth hormone releasing hormone (GHRH) that stimulates the release of growth hormone and IGF-1.',
          mechanism: 'Binds to GHRH receptors on the pituitary gland, stimulating the production and release of growth hormone in a pulsatile manner.',
          commonDosage: '1-2 mg',
          commonFrequency: 'Weekly',
          averageRating: 4.1,
          totalExperiences: 98,
          commonEffects: ['Increased IGF-1', 'Better recovery', 'Anti-aging', 'Improved sleep'],
          sideEffects: ['Injection site reactions', 'Flu-like symptoms', 'Water retention'],
          popularity: 65,
          commonStacks: ['Ipamorelin', 'GHRP-6'],
          dosageRanges: {
            low: '1-1.5 mg',
            medium: '1.5-2 mg',
            high: '2-3 mg'
          },
          timeline: {
            onset: '1-2 weeks',
            peak: '3-4 weeks',
            duration: '3-4 weeks post-cycle'
          }
        },
        {
          name: 'PT-141',
          category: 'Performance & Enhancement',
          description: 'Melanocortin receptor agonist',
          detailedDescription: 'PT-141 (Bremelanotide) is a synthetic peptide that acts as a melanocortin receptor agonist, primarily affecting libido and sexual function.',
          mechanism: 'Acts on melanocortin receptors in the brain to enhance sexual desire and arousal through central nervous system pathways.',
          commonDosage: '0.5-2 mg',
          commonFrequency: 'As needed',
          averageRating: 3.9,
          totalExperiences: 76,
          commonEffects: ['Enhanced libido', 'Improved performance', 'Increased arousal'],
          sideEffects: ['Nausea', 'Flushing', 'Decreased appetite', 'Headaches'],
          popularity: 42,
          commonStacks: ['Tadalafil', 'Oxytocin'],
          dosageRanges: {
            low: '0.5-1 mg',
            medium: '1-1.5 mg',
            high: '1.5-2 mg'
          },
          timeline: {
            onset: '30-60 minutes',
            peak: '2-4 hours',
            duration: '6-12 hours'
          }
        },
        {
          name: 'Melanotan II',
          category: 'Performance & Enhancement',
          description: 'Synthetic analog of melanocyte-stimulating hormone',
          detailedDescription: 'Melanotan II is a synthetic analog of the peptide hormone α-melanocyte-stimulating hormone that stimulates melanogenesis and has effects on libido.',
          mechanism: 'Binds to melanocortin receptors, stimulating melanin production and having effects on sexual behavior and appetite.',
          commonDosage: '0.25-1 mg',
          commonFrequency: 'Daily',
          averageRating: 3.7,
          totalExperiences: 134,
          commonEffects: ['Skin tanning', 'Appetite suppression', 'Enhanced libido'],
          sideEffects: ['Nausea', 'Facial flushing', 'Darkening of moles', 'Injection site reactions'],
          popularity: 38,
          commonStacks: ['PT-141'],
          dosageRanges: {
            low: '0.25-0.5 mg',
            medium: '0.5-0.75 mg',
            high: '0.75-1 mg'
          },
          timeline: {
            onset: '2-4 hours',
            peak: '6-8 hours',
            duration: '12-24 hours'
          }
        },
        {
          name: 'GHRP-6',
          category: 'Growth Hormone',
          description: 'Growth hormone releasing peptide-6',
          detailedDescription: 'GHRP-6 is a synthetic hexapeptide that stimulates the release of growth hormone. It is known for its strong appetite-stimulating effects and growth hormone release.',
          mechanism: 'Binds to the ghrelin receptor and stimulates the release of growth hormone through the activation of the hypothalamic-pituitary axis.',
          commonDosage: '100-200 mcg',
          commonFrequency: '2-3x daily',
          averageRating: 4.0,
          totalExperiences: 145,
          commonEffects: ['Increased appetite', 'Better recovery', 'Muscle growth', 'Improved sleep'],
          sideEffects: ['Water retention', 'Increased hunger', 'Temporary numbness'],
          popularity: 75,
          commonStacks: ['CJC-1295', 'Ipamorelin'],
          dosageRanges: {
            low: '100-150 mcg',
            medium: '150-200 mcg',
            high: '200-300 mcg'
          },
          timeline: {
            onset: '1-2 weeks',
            peak: '3-4 weeks',
            duration: '2-3 weeks post-cycle'
          }
        },
        {
          name: 'Thymosin Alpha-1',
          category: 'Healing & Recovery',
          description: 'Immunomodulatory peptide',
          detailedDescription: 'Thymosin Alpha-1 is a naturally occurring peptide that plays a crucial role in immune system regulation and has shown potential in various therapeutic applications.',
          mechanism: 'Modulates immune function by stimulating T-cell production and enhancing the body\'s natural defense mechanisms.',
          commonDosage: '1-2 mg',
          commonFrequency: 'Weekly',
          averageRating: 4.2,
          totalExperiences: 89,
          commonEffects: ['Enhanced immunity', 'Better recovery', 'Reduced inflammation', 'Improved energy'],
          sideEffects: ['Injection site reactions', 'Mild fatigue', 'Headaches'],
          popularity: 65,
          commonStacks: ['BPC-157', 'TB-500'],
          dosageRanges: {
            low: '1-1.5 mg',
            medium: '1.5-2 mg',
            high: '2-2.5 mg'
          },
          timeline: {
            onset: '2-3 weeks',
            peak: '4-6 weeks',
            duration: '4-6 weeks post-cycle'
          }
        },
        {
          name: 'Sermorelin',
          category: 'Growth Hormone',
          description: 'Growth hormone releasing hormone analog',
          detailedDescription: 'Sermorelin is a synthetic analog of growth hormone releasing hormone (GHRH) that stimulates the natural production of growth hormone.',
          mechanism: 'Binds to GHRH receptors in the pituitary gland, stimulating the production and release of growth hormone in a natural pulsatile pattern.',
          commonDosage: '100-300 mcg',
          commonFrequency: 'Daily',
          averageRating: 4.1,
          totalExperiences: 112,
          commonEffects: ['Anti-aging', 'Better sleep', 'Improved recovery', 'Enhanced well-being'],
          sideEffects: ['Injection site reactions', 'Water retention', 'Joint pain'],
          popularity: 70,
          commonStacks: ['Ipamorelin', 'CJC-1295'],
          dosageRanges: {
            low: '100-200 mcg',
            medium: '200-300 mcg',
            high: '300-400 mcg'
          },
          timeline: {
            onset: '2-3 weeks',
            peak: '4-6 weeks',
            duration: '3-4 weeks post-cycle'
          }
        },
        {
          name: 'DSIP',
          category: 'Cognitive Enhancement',
          description: 'Delta sleep-inducing peptide',
          detailedDescription: 'DSIP is a naturally occurring peptide that promotes deep sleep and has been studied for its potential in sleep regulation and stress management.',
          mechanism: 'Acts on the central nervous system to promote delta wave sleep and modulate stress response through interaction with various neurotransmitter systems.',
          commonDosage: '100-200 mcg',
          commonFrequency: 'Daily',
          averageRating: 4.3,
          totalExperiences: 78,
          commonEffects: ['Better sleep quality', 'Reduced stress', 'Improved recovery', 'Enhanced mood'],
          sideEffects: ['Drowsiness', 'Mild headaches', 'Temporary fatigue'],
          popularity: 60,
          commonStacks: ['Melanotan II', 'PT-141'],
          dosageRanges: {
            low: '100-150 mcg',
            medium: '150-200 mcg',
            high: '200-250 mcg'
          },
          timeline: {
            onset: '1-2 days',
            peak: '1-2 weeks',
            duration: '1-2 days post-dose'
          }
        },
        {
          name: 'Epitalon',
          category: 'Anti-Aging',
          description: 'Telomere-supporting peptide',
          detailedDescription: 'Epitalon is a synthetic peptide that has shown potential in supporting telomere health and cellular longevity.',
          mechanism: 'Regulates telomerase activity and supports cellular repair mechanisms through interaction with the pineal gland and various cellular pathways.',
          commonDosage: '5-10 mg',
          commonFrequency: 'Daily',
          averageRating: 4.0,
          totalExperiences: 92,
          commonEffects: ['Anti-aging', 'Better sleep', 'Enhanced recovery', 'Improved energy'],
          sideEffects: ['Mild injection site reactions', 'Temporary fatigue'],
          popularity: 55,
          commonStacks: ['Thymosin Alpha-1', 'BPC-157'],
          dosageRanges: {
            low: '5-7 mg',
            medium: '7-10 mg',
            high: '10-15 mg'
          },
          timeline: {
            onset: '2-3 weeks',
            peak: '4-6 weeks',
            duration: '4-6 weeks post-cycle'
          }
        },
        {
          name: 'Selank',
          category: 'Cognitive Enhancement',
          description: 'Anxiolytic and nootropic peptide',
          detailedDescription: 'Selank is a synthetic peptide with anxiolytic and nootropic properties, derived from the immunomodulatory peptide tuftsin.',
          mechanism: 'Modulates GABA and serotonin systems while enhancing BDNF expression, leading to reduced anxiety and improved cognitive function.',
          commonDosage: '200-400 mcg',
          commonFrequency: 'Daily',
          averageRating: 4.2,
          totalExperiences: 85,
          commonEffects: ['Reduced anxiety', 'Better focus', 'Enhanced memory', 'Improved mood'],
          sideEffects: ['Mild headaches', 'Temporary drowsiness', 'Injection site reactions'],
          popularity: 68,
          commonStacks: ['Semax', 'Cerebrolysin'],
          dosageRanges: {
            low: '200-300 mcg',
            medium: '300-400 mcg',
            high: '400-500 mcg'
          },
          timeline: {
            onset: '1-2 hours',
            peak: '4-6 hours',
            duration: '12-24 hours'
          }
        },
        {
          name: 'Semax',
          category: 'Cognitive Enhancement',
          description: 'Nootropic peptide',
          detailedDescription: 'Semax is a synthetic peptide with potent nootropic properties, derived from ACTH(4-10).',
          mechanism: 'Enhances BDNF expression and modulates neurotransmitter systems, particularly dopamine and serotonin, leading to improved cognitive function.',
          commonDosage: '200-400 mcg',
          commonFrequency: 'Daily',
          averageRating: 4.4,
          totalExperiences: 95,
          commonEffects: ['Enhanced focus', 'Better memory', 'Improved mood', 'Increased energy'],
          sideEffects: ['Mild headaches', 'Temporary anxiety', 'Insomnia'],
          popularity: 72,
          commonStacks: ['Selank', 'Cerebrolysin'],
          dosageRanges: {
            low: '200-300 mcg',
            medium: '300-400 mcg',
            high: '400-500 mcg'
          },
          timeline: {
            onset: '30-60 minutes',
            peak: '2-4 hours',
            duration: '8-12 hours'
          }
        },
        {
          name: 'Hexarelin',
          category: 'Growth Hormone',
          description: 'Growth hormone releasing peptide',
          detailedDescription: 'Hexarelin is a synthetic hexapeptide that strongly stimulates growth hormone release and has shown potential in various therapeutic applications.',
          mechanism: 'Binds to the ghrelin receptor and stimulates growth hormone release through the activation of the hypothalamic-pituitary axis.',
          commonDosage: '100-200 mcg',
          commonFrequency: '2-3x daily',
          averageRating: 4.1,
          totalExperiences: 88,
          commonEffects: ['Muscle growth', 'Better recovery', 'Improved sleep', 'Enhanced well-being'],
          sideEffects: ['Increased appetite', 'Water retention', 'Temporary numbness'],
          popularity: 65,
          commonStacks: ['CJC-1295', 'Ipamorelin'],
          dosageRanges: {
            low: '100-150 mcg',
            medium: '150-200 mcg',
            high: '200-300 mcg'
          },
          timeline: {
            onset: '1-2 weeks',
            peak: '3-4 weeks',
            duration: '2-3 weeks post-cycle'
          }
        },
        {
          name: 'GLP-1',
          category: 'Metabolic Health',
          description: 'Glucagon-like peptide-1',
          detailedDescription: 'GLP-1 is a naturally occurring incretin hormone that plays a crucial role in glucose metabolism and appetite regulation. It is produced in the intestinal L-cells and has multiple effects on glucose homeostasis.',
          mechanism: 'Binds to GLP-1 receptors in the pancreas, brain, and other tissues, stimulating insulin secretion, inhibiting glucagon release, slowing gastric emptying, and promoting satiety.',
          commonDosage: '0.5-2 mg',
          commonFrequency: 'Daily',
          averageRating: 4.6,
          totalExperiences: 245,
          commonEffects: ['Appetite suppression', 'Blood sugar control', 'Weight loss', 'Improved satiety'],
          sideEffects: ['Nausea', 'Gastrointestinal discomfort', 'Headaches', 'Dizziness'],
          popularity: 90,
          commonStacks: ['Semaglutide', 'Tirzepatide'],
          dosageRanges: {
            low: '0.5-1 mg',
            medium: '1-1.5 mg',
            high: '1.5-2 mg'
          },
          timeline: {
            onset: '1-2 hours',
            peak: '2-4 hours',
            duration: '6-8 hours'
          }
        },
        {
          name: 'Semaglutide',
          category: 'Metabolic Health',
          description: 'GLP-1 receptor agonist',
          detailedDescription: 'Semaglutide is a long-acting GLP-1 receptor agonist that has shown significant efficacy in weight management and glycemic control. It has a longer half-life than native GLP-1.',
          mechanism: 'Binds to GLP-1 receptors with high affinity, providing sustained activation of the GLP-1 pathway, leading to reduced appetite and improved glucose control.',
          commonDosage: '0.25-2.4 mg',
          commonFrequency: 'Weekly',
          averageRating: 4.7,
          totalExperiences: 312,
          commonEffects: ['Significant weight loss', 'Improved glycemic control', 'Reduced appetite', 'Better satiety'],
          sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain'],
          popularity: 95,
          commonStacks: ['Tirzepatide', 'Liraglutide'],
          dosageRanges: {
            low: '0.25-0.5 mg',
            medium: '1-1.7 mg',
            high: '2-2.4 mg'
          },
          timeline: {
            onset: '1-2 days',
            peak: '4-8 weeks',
            duration: '1 week'
          }
        },
        {
          name: 'Tirzepatide',
          category: 'Metabolic Health',
          description: 'Dual GIP/GLP-1 receptor agonist',
          detailedDescription: 'Tirzepatide is a novel dual agonist that activates both GIP and GLP-1 receptors, offering enhanced metabolic benefits compared to single-receptor agonists.',
          mechanism: 'Simultaneously activates GIP and GLP-1 receptors, providing synergistic effects on glucose control, weight loss, and metabolic health.',
          commonDosage: '2.5-15 mg',
          commonFrequency: 'Weekly',
          averageRating: 4.8,
          totalExperiences: 198,
          commonEffects: ['Enhanced weight loss', 'Superior glycemic control', 'Improved insulin sensitivity', 'Better satiety'],
          sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Decreased appetite', 'Abdominal pain'],
          popularity: 92,
          commonStacks: ['Semaglutide', 'Liraglutide'],
          dosageRanges: {
            low: '2.5-5 mg',
            medium: '7.5-10 mg',
            high: '12.5-15 mg'
          },
          timeline: {
            onset: '1-2 days',
            peak: '4-8 weeks',
            duration: '1 week'
          }
        },
        {
          name: 'Liraglutide',
          category: 'Metabolic Health',
          description: 'GLP-1 receptor agonist',
          detailedDescription: 'Liraglutide is a long-acting GLP-1 receptor agonist that has been extensively studied for its effects on weight management and type 2 diabetes.',
          mechanism: 'Binds to GLP-1 receptors with high affinity, providing sustained activation of the GLP-1 pathway, leading to reduced appetite and improved glucose control.',
          commonDosage: '0.6-3 mg',
          commonFrequency: 'Daily',
          averageRating: 4.5,
          totalExperiences: 278,
          commonEffects: ['Weight loss', 'Improved glycemic control', 'Reduced appetite', 'Better satiety'],
          sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain'],
          popularity: 88,
          commonStacks: ['Semaglutide', 'Tirzepatide'],
          dosageRanges: {
            low: '0.6-1.2 mg',
            medium: '1.8-2.4 mg',
            high: '2.4-3 mg'
          },
          timeline: {
            onset: '1-2 days',
            peak: '2-4 weeks',
            duration: '24 hours'
          }
        },
        {
          name: 'Exenatide',
          category: 'Metabolic Health',
          description: 'GLP-1 receptor agonist',
          detailedDescription: 'Exenatide is a synthetic version of exendin-4, a GLP-1 receptor agonist derived from the saliva of the Gila monster. It has been used for type 2 diabetes management.',
          mechanism: 'Binds to GLP-1 receptors, stimulating insulin secretion, inhibiting glucagon release, and slowing gastric emptying.',
          commonDosage: '5-10 mcg',
          commonFrequency: 'Twice daily',
          averageRating: 4.3,
          totalExperiences: 156,
          commonEffects: ['Weight loss', 'Improved glycemic control', 'Reduced appetite', 'Better satiety'],
          sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Dizziness', 'Headaches'],
          popularity: 75,
          commonStacks: ['Semaglutide', 'Liraglutide'],
          dosageRanges: {
            low: '5 mcg',
            medium: '7.5 mcg',
            high: '10 mcg'
          },
          timeline: {
            onset: '1-2 hours',
            peak: '2-3 hours',
            duration: '6-8 hours'
          }
        },
        {
          name: 'Dulaglutide',
          category: 'Metabolic Health',
          description: 'Long-acting GLP-1 receptor agonist',
          detailedDescription: 'Dulaglutide is a long-acting GLP-1 receptor agonist that has shown efficacy in glycemic control and weight management in type 2 diabetes.',
          mechanism: 'Binds to GLP-1 receptors with high affinity, providing sustained activation of the GLP-1 pathway, leading to reduced appetite and improved glucose control.',
          commonDosage: '0.75-4.5 mg',
          commonFrequency: 'Weekly',
          averageRating: 4.4,
          totalExperiences: 189,
          commonEffects: ['Weight loss', 'Improved glycemic control', 'Reduced appetite', 'Better satiety'],
          sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Decreased appetite'],
          popularity: 82,
          commonStacks: ['Semaglutide', 'Tirzepatide'],
          dosageRanges: {
            low: '0.75-1.5 mg',
            medium: '2.25-3 mg',
            high: '3.75-4.5 mg'
          },
          timeline: {
            onset: '1-2 days',
            peak: '2-4 weeks',
            duration: '1 week'
          }
        },
        {
          name: 'Retatrutide',
          category: 'Metabolic Health',
          description: 'Triple agonist (GLP-1/GIP/Glucagon)',
          detailedDescription: 'Retatrutide is a novel investigational triple agonist that simultaneously activates GLP-1, GIP, and glucagon receptors. This unique mechanism offers enhanced metabolic benefits compared to single or dual agonists.',
          mechanism: 'Simultaneously activates GLP-1, GIP, and glucagon receptors, providing synergistic effects on glucose control, weight loss, and metabolic health through multiple pathways.',
          commonDosage: '1-12 mg',
          commonFrequency: 'Weekly',
          averageRating: 4.9,
          totalExperiences: 156,
          commonEffects: ['Enhanced weight loss', 'Superior glycemic control', 'Improved insulin sensitivity', 'Better satiety', 'Increased energy expenditure'],
          sideEffects: ['Nausea', 'Vomiting', 'Diarrhea', 'Decreased appetite', 'Abdominal pain', 'Increased heart rate'],
          popularity: 94,
          commonStacks: ['Semaglutide', 'Tirzepatide'],
          dosageRanges: {
            low: '1-4 mg',
            medium: '5-8 mg',
            high: '9-12 mg'
          },
          timeline: {
            onset: '1-2 days',
            peak: '4-8 weeks',
            duration: '1 week'
          }
        }
      ];

      const insertedPeptides = await Peptide.insertMany(initialPeptides);

      return {
        success: true,
        message: 'Peptides seeded successfully',
        count: insertedPeptides.length,
        peptides: insertedPeptides.map(p => ({ id: p._id, name: p.name }))
      };

    } catch (error) {
      console.error('Error seeding peptides:', error);
      throw new Error(`Failed to seed peptides: ${error.message}`);
    }
  }

  /**
   * Clears all peptide data from the database
   * @returns {Promise<Object>} Result of clearing operation
   */
  static async clearPeptides() {
    try {
      const result = await Peptide.deleteMany({});
      return {
        success: true,
        message: 'All peptides cleared successfully',
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('Error clearing peptides:', error);
      throw new Error(`Failed to clear peptides: ${error.message}`);
    }
  }

  /**
   * Seeds the database with initial effects and side effects data
   * @returns {Promise<Object>} Result of seeding operation
   */
  static async seedEffects() {
    try {
      // Check if effects already exist
      const existingEffects = await Effect.countDocuments();
      if (existingEffects > 0) {
        return {
          success: true,
          message: 'Effects already exist in database',
          count: existingEffects
        };
      }

      const initialEffects = [
        // Positive Effects - Physical Performance
        {
          name: 'Increased strength',
          description: 'Enhanced muscular strength and power output',
          type: 'positive',
          category: 'Physical Performance',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Improved endurance',
          description: 'Better cardiovascular and muscular endurance',
          type: 'positive',
          category: 'Physical Performance',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Enhanced muscle growth',
          description: 'Increased lean muscle mass and hypertrophy',
          type: 'positive',
          category: 'Physical Performance',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Better flexibility',
          description: 'Improved joint mobility and muscle flexibility',
          type: 'positive',
          category: 'Physical Performance',
          frequency: 'common',
          isCommon: true
        },

        // Positive Effects - Recovery
        {
          name: 'Faster healing',
          description: 'Accelerated wound healing and tissue repair',
          type: 'positive',
          category: 'Recovery',
          frequency: 'very_common',
          isCommon: true
        },
        {
          name: 'Reduced inflammation',
          description: 'Decreased inflammatory response and swelling',
          type: 'positive',
          category: 'Recovery',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Improved recovery time',
          description: 'Shorter time needed between training sessions',
          type: 'positive',
          category: 'Recovery',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Pain relief',
          description: 'Reduction in chronic or acute pain symptoms',
          type: 'positive',
          category: 'Recovery',
          frequency: 'common',
          isCommon: true
        },

        // Positive Effects - Mental/Cognitive
        {
          name: 'Better mood',
          description: 'Improved overall mood and emotional well-being',
          type: 'positive',
          category: 'Mental/Cognitive',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Enhanced focus',
          description: 'Improved concentration and mental clarity',
          type: 'positive',
          category: 'Mental/Cognitive',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Reduced anxiety',
          description: 'Decreased feelings of anxiety and stress',
          type: 'positive',
          category: 'Mental/Cognitive',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Increased motivation',
          description: 'Enhanced drive and motivation levels',
          type: 'positive',
          category: 'Mental/Cognitive',
          frequency: 'uncommon',
          isCommon: false
        },

        // Positive Effects - Appearance
        {
          name: 'Improved skin quality',
          description: 'Better skin texture, tone, and overall appearance',
          type: 'positive',
          category: 'Appearance',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Fat loss',
          description: 'Reduction in body fat percentage',
          type: 'positive',
          category: 'Appearance',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Hair growth',
          description: 'Improved hair thickness and growth rate',
          type: 'positive',
          category: 'Appearance',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Skin tanning',
          description: 'Increased melanin production and skin pigmentation',
          type: 'positive',
          category: 'Appearance',
          frequency: 'uncommon',
          isCommon: false
        },

        // Positive Effects - Sleep
        {
          name: 'Better sleep quality',
          description: 'Improved depth and quality of sleep',
          type: 'positive',
          category: 'Sleep',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Faster sleep onset',
          description: 'Reduced time needed to fall asleep',
          type: 'positive',
          category: 'Sleep',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Increased deep sleep',
          description: 'More time spent in restorative deep sleep phases',
          type: 'positive',
          category: 'Sleep',
          frequency: 'uncommon',
          isCommon: false
        },

        // Positive Effects - Metabolic
        {
          name: 'Increased energy',
          description: 'Higher overall energy levels throughout the day',
          type: 'positive',
          category: 'Metabolic',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Better appetite regulation',
          description: 'Improved control over hunger and satiety',
          type: 'positive',
          category: 'Metabolic',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Enhanced libido',
          description: 'Increased sexual desire and function',
          type: 'positive',
          category: 'Metabolic',
          frequency: 'uncommon',
          isCommon: false
        },

        // Side Effects - Mild
        {
          name: 'Injection site irritation',
          description: 'Redness, swelling, or discomfort at injection site',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Mild headaches',
          description: 'Occasional headaches of mild intensity',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Temporary fatigue',
          description: 'Short-term feelings of tiredness or lethargy',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Water retention',
          description: 'Mild fluid retention and bloating',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Increased appetite',
          description: 'Enhanced hunger and food cravings',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        },

        // Side Effects - Moderate
        {
          name: 'Nausea',
          description: 'Feelings of sickness and stomach discomfort',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Facial flushing',
          description: 'Redness and warmth in facial area',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Sleep disturbances',
          description: 'Difficulty falling asleep or staying asleep',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Joint pain',
          description: 'Discomfort or pain in joints',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Flu-like symptoms',
          description: 'General malaise, aches, and cold-like symptoms',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'uncommon',
          isCommon: false
        },

        // Side Effects - Severe
        {
          name: 'Severe allergic reaction',
          description: 'Serious allergic response requiring medical attention',
          type: 'negative',
          category: 'Side Effect',
          severity: 'severe',
          frequency: 'rare',
          isCommon: false
        },
        {
          name: 'Cardiac arrhythmia',
          description: 'Irregular heart rhythm or palpitations',
          type: 'negative',
          category: 'Side Effect',
          severity: 'severe',
          frequency: 'rare',
          isCommon: false
        },
        {
          name: 'Severe mood changes',
          description: 'Significant alterations in mood or behavior',
          type: 'negative',
          category: 'Side Effect',
          severity: 'severe',
          frequency: 'rare',
          isCommon: false
        },

        // Additional common effects
        {
          name: 'Improved gut health',
          description: 'Better digestive function and gut healing',
          type: 'positive',
          category: 'Recovery',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Better joints',
          description: 'Improved joint health and reduced stiffness',
          type: 'positive',
          category: 'Recovery',
          frequency: 'common',
          isCommon: true
        },
        {
          name: 'Anti-aging effects',
          description: 'Improved markers of aging and cellular health',
          type: 'positive',
          category: 'Metabolic',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Numbness in extremities',
          description: 'Temporary loss of sensation in hands or feet',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Darkening of moles',
          description: 'Increased pigmentation of existing moles',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'uncommon',
          isCommon: false
        },
        {
          name: 'Decreased appetite',
          description: 'Reduced hunger and food intake',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        }
      ];

      const insertedEffects = await Effect.insertMany(initialEffects);

      return {
        success: true,
        message: 'Effects seeded successfully',
        count: insertedEffects.length,
        effects: insertedEffects.map(e => ({ 
          id: e._id, 
          name: e.name, 
          type: e.type, 
          category: e.category 
        }))
      };

    } catch (error) {
      console.error('Error seeding effects:', error);
      throw new Error(`Failed to seed effects: ${error.message}`);
    }
  }

  /**
   * Clears all effects data from the database
   * @returns {Promise<Object>} Result of clearing operation
   */
  static async clearEffects() {
    try {
      const result = await Effect.deleteMany({});
      return {
        success: true,
        message: 'All effects cleared successfully',
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('Error clearing effects:', error);
      throw new Error(`Failed to clear effects: ${error.message}`);
    }
  }
}

module.exports = SeedService;