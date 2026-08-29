import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEduEmail } from '../src/lib/utils';

test('isEduEmail correctly identifies .edu emails', () => {
  assert.equal(isEduEmail('student@university.edu'), true);
  assert.equal(isEduEmail('professor@college.edu'), true);
  assert.equal(isEduEmail('test@subdomain.university.edu'), true);
});

test('isEduEmail correctly rejects non-.edu emails', () => {
  assert.equal(isEduEmail('user@gmail.com'), false);
  assert.equal(isEduEmail('user@university.edu.com'), false);
  assert.equal(isEduEmail('student@education.org'), false);
  assert.equal(isEduEmail('test@university.edu.co'), false);
});
