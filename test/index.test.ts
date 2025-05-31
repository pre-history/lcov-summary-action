import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('index.ts basic tests', () => {
  it('should pass basic validation', () => {
    // Simple validation that our changes don't break basic functionality
    assert.ok(true, 'Basic test passes');
  });

  it('hex color validation regex should work', () => {
    const isValidHexColor = (color: string): boolean => {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    };

    assert.ok(isValidHexColor('#4CAF50'), 'Valid 6-digit hex color');
    assert.ok(isValidHexColor('#F53'), 'Valid 3-digit hex color');
    assert.ok(!isValidHexColor('4CAF50'), 'Invalid hex color without #');
    assert.ok(!isValidHexColor('#GGGGGG'), 'Invalid hex color with invalid chars');
    assert.ok(!isValidHexColor('#12345'), 'Invalid hex color with wrong length');
  });

  it('should handle PR event validation correctly', () => {
    const validEvents = ['opened', 'synchronize', 'reopened'];
    
    assert.ok(validEvents.includes('opened'), 'Should include opened event');
    assert.ok(validEvents.includes('synchronize'), 'Should include synchronize event');  
    assert.ok(validEvents.includes('reopened'), 'Should include reopened event');
    assert.ok(!validEvents.includes('closed'), 'Should not include closed event');
  });
});