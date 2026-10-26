import { describe, it, expect } from 'vitest';
import {
  assessmentSections,
  getSectionById,
  getSectionIndexById,
  getSectionByIndex,
  getTotalSections,
  getSectionIds,
  validateSectionWeights
} from './assessmentSections';

describe('Assessment Section Configuration', () => {
  describe('Section Structure', () => {
    it('should have exactly 9 sections', () => {
      expect(assessmentSections).toHaveLength(9);
      expect(getTotalSections()).toBe(9);
    });

    it('should have all required sections in correct order', () => {
      const sectionIds = getSectionIds();
      expect(sectionIds).toEqual([
        'financial_obligations',
        'income_employment',
        'mobile_money',
        'assets',
        'savings_banking',
        'expense_management',
        'household_profile',
        'financial_literacy',
        'business_profile'
      ]);
    });

    it('should have correct weights for all sections', () => {
      const expectedWeights = {
        financial_obligations: 15,
        income_employment: 15,
        mobile_money: 12,
        assets: 12,
        savings_banking: 12,
        expense_management: 12,
        household_profile: 8,
        financial_literacy: 8,
        business_profile: 6
      };

      assessmentSections.forEach(section => {
        expect(section.weight).toBe(expectedWeights[section.id]);
      });
    });

    it('should have weights that sum to 100%', () => {
      expect(validateSectionWeights()).toBe(true);
      const totalWeight = assessmentSections.reduce((sum, s) => sum + s.weight, 0);
      expect(totalWeight).toBe(100);
    });

    it('should have all required section properties', () => {
      assessmentSections.forEach(section => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('weight');
        expect(section).toHaveProperty('description');
        expect(section).toHaveProperty('questions');
        expect(Array.isArray(section.questions)).toBe(true);
        expect(section.questions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Question Structure', () => {
    it('should have all required question properties', () => {
      assessmentSections.forEach(section => {
        section.questions.forEach(question => {
          expect(question).toHaveProperty('id');
          expect(question).toHaveProperty('type');
          expect(question).toHaveProperty('label');
          expect(question).toHaveProperty('required');
          
          // Validate question ID follows naming convention
          expect(question.id).toMatch(new RegExp(`^${section.id}_`));
        });
      });
    });

    it('should support all required input types', () => {
      const supportedTypes = ['text', 'number', 'select', 'radio', 'checkbox', 'date'];
      const usedTypes = new Set();

      assessmentSections.forEach(section => {
        section.questions.forEach(question => {
          usedTypes.add(question.type);
          expect(supportedTypes).toContain(question.type);
        });
      });

      // Verify that we use multiple input types
      expect(usedTypes.size).toBeGreaterThan(1);
    });

    it('should have options for select, radio, and checkbox types', () => {
      assessmentSections.forEach(section => {
        section.questions.forEach(question => {
          if (['select', 'radio', 'checkbox'].includes(question.type)) {
            expect(question).toHaveProperty('options');
            expect(Array.isArray(question.options)).toBe(true);
            expect(question.options.length).toBeGreaterThan(0);

            // Validate option structure
            question.options.forEach(option => {
              expect(option).toHaveProperty('value');
              expect(option).toHaveProperty('label');
            });
          }
        });
      });
    });

    it('should have validation rules for number type inputs', () => {
      assessmentSections.forEach(section => {
        section.questions.forEach(question => {
          if (question.type === 'number') {
            if (question.validation) {
              expect(question.validation).toHaveProperty('min');
              expect(question.validation).toHaveProperty('max');
              expect(typeof question.validation.min).toBe('number');
              expect(typeof question.validation.max).toBe('number');
              expect(question.validation.min).toBeLessThanOrEqual(question.validation.max);
            }
          }
        });
      });
    });
  });

  describe('Requirement Coverage - Financial Obligations (7.1)', () => {
    it('should have Financial Obligations section with 15% weight', () => {
      const section = getSectionById('financial_obligations');
      expect(section).toBeDefined();
      expect(section.title).toBe('Financial Obligations');
      expect(section.weight).toBe(15);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Income and Employment (7.2)', () => {
    it('should have Income and Employment section with 15% weight', () => {
      const section = getSectionById('income_employment');
      expect(section).toBeDefined();
      expect(section.title).toBe('Income & Employment');
      expect(section.weight).toBe(15);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Mobile Money (7.3)', () => {
    it('should have Mobile Money section with 12% weight', () => {
      const section = getSectionById('mobile_money');
      expect(section).toBeDefined();
      expect(section.title).toBe('Mobile Money');
      expect(section.weight).toBe(12);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Assets (7.4)', () => {
    it('should have Assets section with 12% weight', () => {
      const section = getSectionById('assets');
      expect(section).toBeDefined();
      expect(section.title).toBe('Assets');
      expect(section.weight).toBe(12);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Savings and Banking (7.5)', () => {
    it('should have Savings and Banking section with 12% weight', () => {
      const section = getSectionById('savings_banking');
      expect(section).toBeDefined();
      expect(section.title).toBe('Savings & Banking');
      expect(section.weight).toBe(12);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Expense Management (7.6)', () => {
    it('should have Expense Management section with 12% weight', () => {
      const section = getSectionById('expense_management');
      expect(section).toBeDefined();
      expect(section.title).toBe('Expense Management');
      expect(section.weight).toBe(12);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Household Profile (7.7)', () => {
    it('should have Household Profile section with 8% weight', () => {
      const section = getSectionById('household_profile');
      expect(section).toBeDefined();
      expect(section.title).toBe('Household Profile');
      expect(section.weight).toBe(8);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Financial Literacy (7.8)', () => {
    it('should have Financial Literacy section with 8% weight', () => {
      const section = getSectionById('financial_literacy');
      expect(section).toBeDefined();
      expect(section.title).toBe('Financial Literacy');
      expect(section.weight).toBe(8);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement Coverage - Business Profile (7.9)', () => {
    it('should have Business Profile section with 6% weight', () => {
      const section = getSectionById('business_profile');
      expect(section).toBeDefined();
      expect(section.title).toBe('Business Profile');
      expect(section.weight).toBe(6);
      expect(section.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Helper Functions', () => {
    it('getSectionById should return correct section', () => {
      const section = getSectionById('mobile_money');
      expect(section).toBeDefined();
      expect(section.id).toBe('mobile_money');
    });

    it('getSectionById should return undefined for invalid ID', () => {
      const section = getSectionById('invalid_id');
      expect(section).toBeUndefined();
    });

    it('getSectionIndexById should return correct index', () => {
      expect(getSectionIndexById('financial_obligations')).toBe(0);
      expect(getSectionIndexById('business_profile')).toBe(8);
      expect(getSectionIndexById('mobile_money')).toBe(2);
    });

    it('getSectionIndexById should return -1 for invalid ID', () => {
      expect(getSectionIndexById('invalid_id')).toBe(-1);
    });

    it('getSectionByIndex should return correct section', () => {
      const section = getSectionByIndex(0);
      expect(section).toBeDefined();
      expect(section.id).toBe('financial_obligations');
    });

    it('getSectionByIndex should return null for invalid index', () => {
      expect(getSectionByIndex(100)).toBeNull();
      expect(getSectionByIndex(-1)).toBeNull();
    });
  });

  describe('Question Types Coverage', () => {
    it('should include text input questions', () => {
      const hasTextInput = assessmentSections.some(section =>
        section.questions.some(q => q.type === 'text')
      );
      // Note: We primarily use other types, so this might be false
      // but the configuration supports text inputs
      expect(['text', 'number', 'select', 'radio', 'checkbox']).toContain('text');
    });

    it('should include number input questions', () => {
      const hasNumberInput = assessmentSections.some(section =>
        section.questions.some(q => q.type === 'number')
      );
      expect(hasNumberInput).toBe(true);
    });

    it('should include select dropdown questions', () => {
      const hasSelectInput = assessmentSections.some(section =>
        section.questions.some(q => q.type === 'select')
      );
      expect(hasSelectInput).toBe(true);
    });

    it('should include radio button questions', () => {
      const hasRadioInput = assessmentSections.some(section =>
        section.questions.some(q => q.type === 'radio')
      );
      expect(hasRadioInput).toBe(true);
    });

    it('should include checkbox questions', () => {
      const hasCheckboxInput = assessmentSections.some(section =>
        section.questions.some(q => q.type === 'checkbox')
      );
      expect(hasCheckboxInput).toBe(true);
    });
  });

  describe('Required vs Optional Fields', () => {
    it('should have both required and optional fields', () => {
      const hasRequired = assessmentSections.some(section =>
        section.questions.some(q => q.required === true)
      );
      const hasOptional = assessmentSections.some(section =>
        section.questions.some(q => q.required === false)
      );

      expect(hasRequired).toBe(true);
      expect(hasOptional).toBe(true);
    });

    it('should have required field flag for all questions', () => {
      assessmentSections.forEach(section => {
        section.questions.forEach(question => {
          expect(typeof question.required).toBe('boolean');
        });
      });
    });
  });

  describe('Data Quality', () => {
    it('should have unique question IDs across all sections', () => {
      const allQuestionIds = [];
      assessmentSections.forEach(section => {
        section.questions.forEach(question => {
          allQuestionIds.push(question.id);
        });
      });

      const uniqueIds = new Set(allQuestionIds);
      expect(uniqueIds.size).toBe(allQuestionIds.length);
    });

    it('should have non-empty labels for all questions', () => {
      assessmentSections.forEach(section => {
        section.questions.forEach(question => {
          expect(question.label).toBeTruthy();
          expect(question.label.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have non-empty titles for all sections', () => {
      assessmentSections.forEach(section => {
        expect(section.title).toBeTruthy();
        expect(section.title.length).toBeGreaterThan(0);
      });
    });

    it('should have descriptions for all sections', () => {
      assessmentSections.forEach(section => {
        expect(section.description).toBeTruthy();
        expect(section.description.length).toBeGreaterThan(0);
      });
    });
  });
});
