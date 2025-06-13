const Peptide = require('../models/Peptide');
const Experience = require('../models/Experience');

class PeptideService {
  static async getAll() {
    try {
      console.log('PeptideService.getAll called');
      
      // Get all peptides
      const peptides = await Peptide.find({});
      
      // Get experience counts and average ratings for each peptide
      const peptideStats = await Experience.aggregate([
        {
          $group: {
            _id: '$peptideName',
            totalExperiences: { $sum: 1 },
            // Calculate average of all outcome values for each experience
            averageRating: {
              $avg: {
                $avg: {
                  $map: {
                    input: { $objectToArray: '$outcomes' },
                    as: 'outcome',
                    in: '$$outcome.v'
                  }
                }
              }
            }
          }
        }
      ]);
      
      // Create a map of peptide stats for easy lookup
      const statsMap = new Map(
        peptideStats.map(stat => [stat._id, {
          totalExperiences: stat.totalExperiences,
          averageRating: stat.averageRating || 0
        }])
      );
      
      // Add stats to each peptide
      const peptidesWithStats = peptides.map(peptide => {
        const stats = statsMap.get(peptide.name) || { totalExperiences: 0, averageRating: 0 };
        return {
          ...peptide.toObject(),
          totalExperiences: stats.totalExperiences,
          averageRating: stats.averageRating
        };
      });
      
      console.log('PeptideService.getAll completed successfully with real data, count:', peptidesWithStats.length);
      console.log('PeptideService.getAll peptide stats:', peptidesWithStats.map(p => ({
        name: p.name,
        totalExperiences: p.totalExperiences,
        averageRating: p.averageRating
      })));
      
      return peptidesWithStats;
    } catch (error) {
      console.error('PeptideService.getAll error:', error);
      throw error;
    }
  }

  static async getById(peptideId) {
    try {
      console.log('PeptideService.getById called with id:', peptideId);

      const peptide = await Peptide.findById(peptideId);
      if (!peptide) {
        throw new Error('Peptide not found');
      }

      // Get real stats for this peptide
      const stats = await Experience.aggregate([
        { 
          $match: { 
            peptideId: peptide._id,
            isActive: true 
          }
        },
        {
          $group: {
            _id: null,
            totalExperiences: { $sum: 1 },
            averageRating: {
              $avg: {
                $avg: [
                  '$outcomes.energy',
                  '$outcomes.sleep',
                  '$outcomes.mood',
                  '$outcomes.performance',
                  '$outcomes.recovery'
                ]
              }
            }
          }
        }
      ]);

      const peptideStats = stats.length > 0 ? {
        totalExperiences: stats[0].totalExperiences,
        averageRating: Math.round(stats[0].averageRating * 10) / 10
      } : {
        totalExperiences: 0,
        averageRating: 0
      };

      const result = {
        ...peptide.toObject(),
        ...peptideStats
      };

      console.log('PeptideService.getById completed successfully with real data');
      return result;
    } catch (error) {
      console.error('PeptideService.getById error:', error.message);
      throw new Error(`Failed to retrieve peptide: ${error.message}`);
    }
  }

  static async create(peptideData) {
    try {
      console.log('PeptideService.create called with data:', peptideData);

      const peptide = new Peptide(peptideData);
      const savedPeptide = await peptide.save();

      console.log('Peptide created successfully:', savedPeptide._id);
      return savedPeptide;
    } catch (error) {
      console.error('PeptideService.create error:', error.message);
      throw new Error(`Failed to create peptide: ${error.message}`);
    }
  }

  static async update(peptideId, updateData) {
    try {
      console.log('PeptideService.update called with id:', peptideId);

      const updatedPeptide = await Peptide.findByIdAndUpdate(
        peptideId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedPeptide) {
        throw new Error('Peptide not found');
      }

      console.log('Peptide updated successfully:', updatedPeptide._id);
      return updatedPeptide;
    } catch (error) {
      console.error('PeptideService.update error:', error.message);
      throw new Error(`Failed to update peptide: ${error.message}`);
    }
  }

  static async deleteById(peptideId) {
    try {
      console.log('PeptideService.deleteById called with id:', peptideId);

      const deletedPeptide = await Peptide.findByIdAndDelete(peptideId);
      if (!deletedPeptide) {
        throw new Error('Peptide not found');
      }

      console.log('Peptide deleted successfully:', peptideId);
      return { success: true };
    } catch (error) {
      console.error('PeptideService.deleteById error:', error.message);
      throw new Error(`Failed to delete peptide: ${error.message}`);
    }
  }

  static async search(query) {
    try {
      console.log('PeptideService.search called with query:', query);

      const searchRegex = new RegExp(query, 'i');
      const peptides = await Peptide.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      }).sort({ name: 1 });

      console.log('PeptideService.search completed, found:', peptides.length);
      return peptides;
    } catch (error) {
      console.error('PeptideService.search error:', error.message);
      throw new Error(`Failed to search peptides: ${error.message}`);
    }
  }
}

module.exports = PeptideService;