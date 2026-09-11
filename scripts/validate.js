#!/usr/bin/env node

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..");

function fail(message) {
  throw new Error(message);
}

function loadJson(relativePath) {
  const absolutePath = path.join(repositoryRoot, relativePath);

  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireSingleArrayProperty(document, property, relativePath) {
  if (!isPlainObject(document)) {
    fail(`${relativePath} must contain a JSON object.`);
  }

  const keys = Object.keys(document);
  if (keys.length !== 1 || keys[0] !== property || !Array.isArray(document[property])) {
    fail(`${relativePath} must contain only an array property named ${property}.`);
  }

  if (document[property].length === 0) {
    fail(`${relativePath}.${property} must not be empty.`);
  }

  return document[property];
}

function requireNonEmptyString(value, location) {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`${location} must be a non-empty string.`);
  }
}

function requireUnique(values, label) {
  const firstIndexes = new Map();

  values.forEach((value, index) => {
    if (firstIndexes.has(value)) {
      fail(`${label} contains a duplicate at index ${index} (first seen at index ${firstIndexes.get(value)}).`);
    }
    firstIndexes.set(value, index);
  });
}

function validateSchemas() {
  for (const relativePath of ["schemas/images.schema.json", "schemas/phrases.schema.json"]) {
    const schema = loadJson(relativePath);
    if (!isPlainObject(schema) || schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
      fail(`${relativePath} must be a JSON Schema Draft 2020-12 object.`);
    }
  }
}

function validateImages() {
  const images = requireSingleArrayProperty(loadJson("images.json"), "images", "images.json");

  images.forEach((value, index) => {
    requireNonEmptyString(value, `images.json.images[${index}]`);

    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      fail(`images.json.images[${index}] must be a valid HTTP(S) URL.`);
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      fail(`images.json.images[${index}] must use HTTP or HTTPS.`);
    }
  });

  requireUnique(images, "images.json.images");
  return images.length;
}

function validatePhrases() {
  const groups = requireSingleArrayProperty(loadJson("phrases.json"), "phrases", "phrases.json");
  const phrases = [];

  groups.forEach((group, groupIndex) => {
    if (!Array.isArray(group) || group.length === 0) {
      fail(`phrases.json.phrases[${groupIndex}] must be a non-empty array.`);
    }

    group.forEach((value, phraseIndex) => {
      requireNonEmptyString(value, `phrases.json.phrases[${groupIndex}][${phraseIndex}]`);
      phrases.push(value);
    });
  });

  requireUnique(phrases, "phrases.json phrases");
  return { groupCount: groups.length, phraseCount: phrases.length };
}

try {
  validateSchemas();
  const imageCount = validateImages();
  const { groupCount, phraseCount } = validatePhrases();
  console.log(`Validated ${imageCount} unique image URLs and ${phraseCount} unique phrases across ${groupCount} groups.`);
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
  process.exitCode = 1;
}
