// app/api/evaluate/route.js
import { NextResponse } from "next/server";

const PISTON_API = "https://emkc.org/api/v2/piston";

// In-memory rate limit store
const rateLimitStore = new Map();

// Rate limit configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 8,        // Max requests per window
  WINDOW_MS: 60 * 1000,   // 1 minute window
  BLOCK_DURATION_MS: 30 * 1000, // 30 seconds block
};

/**
 * Rate limiting function with detailed logging
 */
function checkRateLimit(identifier) {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);

  console.log(`[Rate Limit] Checking for: ${identifier}`);

  // First request or window expired
  if (!userLimit) {
    console.log(`[Rate Limit] First request for ${identifier}`);
    rateLimitStore.set(identifier, {
      count: 1,
      windowStart: now,
      blockedUntil: null,
    });
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 };
  }

  // Check if window has expired (sliding window)
  const windowAge = now - userLimit.windowStart;
  if (windowAge > RATE_LIMIT.WINDOW_MS) {
    console.log(`[Rate Limit] Window expired for ${identifier}, resetting`);
    rateLimitStore.set(identifier, {
      count: 1,
      windowStart: now,
      blockedUntil: null,
    });
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 };
  }

  // Check if user is currently blocked
  if (userLimit.blockedUntil && now < userLimit.blockedUntil) {
    const retryAfter = Math.ceil((userLimit.blockedUntil - now) / 1000);
    console.log(`[Rate Limit] User ${identifier} is BLOCKED. Retry in ${retryAfter}s`);
    return { allowed: false, retryAfter };
  }

  // Clear block if it has expired
  if (userLimit.blockedUntil && now >= userLimit.blockedUntil) {
    console.log(`[Rate Limit] Block expired for ${identifier}, resetting`);
    userLimit.blockedUntil = null;
    userLimit.count = 1;
    userLimit.windowStart = now;
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 };
  }

  // Increment count
  userLimit.count++;
  console.log(`[Rate Limit] Request count for ${identifier}: ${userLimit.count}/${RATE_LIMIT.MAX_REQUESTS}`);

  // Check if limit exceeded
  if (userLimit.count > RATE_LIMIT.MAX_REQUESTS) {
    userLimit.blockedUntil = now + RATE_LIMIT.BLOCK_DURATION_MS;
    console.log(`[Rate Limit] LIMIT EXCEEDED for ${identifier}. Blocking until ${userLimit.blockedUntil}`);
    return { 
      allowed: false, 
      retryAfter: Math.ceil(RATE_LIMIT.BLOCK_DURATION_MS / 1000) 
    };
  }

  const remaining = RATE_LIMIT.MAX_REQUESTS - userLimit.count;
  console.log(`[Rate Limit] Request ALLOWED. Remaining: ${remaining}`);
  return { allowed: true, remaining };
}

/**
 * Get identifier for rate limiting (userId or IP as fallback)
 */
function getRateLimitIdentifier(userId, req) {
  // Prefer userId if available
  if (userId && typeof userId === 'string' && userId.trim()) {
    return `user:${userId}`;
  }

  // Fallback to IP address
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             req.headers.get("x-real-ip") || 
             "unknown";
  
  return `ip:${ip}`;
}

// Delimiter for batching test cases (using a unique separator)
const TEST_DELIMITER = "|||TEST_SEPARATOR|||";
// All languages now have common library imports included

const LANGUAGE_CONFIG = {
  javascript: {
    language: "javascript",
    version: "18.15.0",
    wrapperTemplate: (code) => `
${code}

const delimiter = "${TEST_DELIMITER}";
const allInputs = process.argv[2] || "";
const inputs = allInputs.split(delimiter);

for (const input of inputs) {
  const result = solve(input);
  console.log(result);
}
`,
    filename: "solution.js",
  },
  
  python: {
    language: "python",
    version: "3.10.0",
    wrapperTemplate: (code) => `
import sys
import math
import re
import collections
import itertools
import functools
from collections import Counter, defaultdict, deque
from itertools import permutations, combinations, accumulate
from functools import reduce, lru_cache

${code}

delimiter = "${TEST_DELIMITER}"
all_inputs = sys.argv[1] if len(sys.argv) > 1 else ""
inputs = all_inputs.split(delimiter)

for input_data in inputs:
    result = solve(input_data)
    print(result)
`,
    filename: "solution.py",
  },
  
  java: {
    language: "java",
    version: "15.0.2",
    wrapperTemplate: (code) => `
import java.util.*;
import java.util.stream.*;
import java.util.regex.*;
import java.math.*;

public class Solution {
    ${code}
    
    public static void main(String[] args) {
        String delimiter = "${TEST_DELIMITER}";
        String allInputs = args.length > 0 ? args[0] : "";
        String[] inputs = allInputs.split(Pattern.quote(delimiter));
        
        for (String input : inputs) {
            System.out.println(solve(input));
        }
    }
}
`,
    filename: "Solution.java",
  },
  
  cpp: {
    language: "cpp",
    version: "10.2.0",
    wrapperTemplate: (code) => `
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
#include <vector>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <deque>
#include <cmath>
#include <climits>
#include <cstring>
#include <numeric>
#include <functional>
using namespace std;

${code}

vector<string> split(const string& str, const string& delimiter) {
    vector<string> tokens;
    size_t start = 0;
    size_t end = str.find(delimiter);
    
    while (end != string::npos) {
        tokens.push_back(str.substr(start, end - start));
        start = end + delimiter.length();
        end = str.find(delimiter, start);
    }
    tokens.push_back(str.substr(start));
    return tokens;
}

int main(int argc, char* argv[]) {
    string delimiter = "${TEST_DELIMITER}";
    string allInputs = argc > 1 ? argv[1] : "";
    vector<string> inputs = split(allInputs, delimiter);
    
    for (const string& input : inputs) {
        cout << solve(input) << endl;
    }
    return 0;
}
`,
    filename: "solution.cpp",
  },
  
  c: {
    language: "c",
    version: "10.2.0",
    wrapperTemplate: (code) => `
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>
#include <math.h>
#include <limits.h>
#include <stdbool.h>

${code}

int main(int argc, char* argv[]) {
    const char* delimiter = "${TEST_DELIMITER}";
    char* all_inputs = argc > 1 ? argv[1] : "";
    
    size_t delim_len = strlen(delimiter);
    char* current = all_inputs;
    char* next;
    
    while (current != NULL && *current != '\\0') {
        // Find next delimiter
        next = strstr(current, delimiter);
        
        // Extract current input
        size_t input_len;
        if (next != NULL) {
            input_len = next - current;
        } else {
            input_len = strlen(current);
        }
        
        // Create a copy of the input for solve()
        char* input_copy = (char*)malloc(input_len + 1);
        strncpy(input_copy, current, input_len);
        input_copy[input_len] = '\\0';
        
        // Call solve and print result
        char* result = solve(input_copy);
        printf("%s\\n", result);
        
        free(input_copy);
        
        // Move to next input
        if (next != NULL) {
            current = next + delim_len;
        } else {
            break;
        }
    }
    
    return 0;
}
`,
    filename: "solution.c",
  },
};

export async function POST(req) {
  try {
    const { code, language = "python", testCases, userId } = await req.json();

    if (!code || !testCases || !Array.isArray(testCases)) {
      return NextResponse.json(
        { error: "Code and test cases are required" },
        { status: 400 }
      );
    }

    // Rate limiting check
    const identifier = getRateLimitIdentifier(userId, req);
    console.log(`[Rate Limit] Identifier: ${identifier}`);
    
    const rateLimitResult = checkRateLimit(identifier);

    if (!rateLimitResult.allowed) {
      console.log(`[Rate Limit] REQUEST BLOCKED for ${identifier}`);
      return NextResponse.json(
        { 
          error: `Whoa there! You're submitting too fast. Take a ${rateLimitResult.retryAfter}s breather and try again.`,
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    console.log(`[Batch Execution] Running ${testCases.length} test cases in ONE Piston call`);

    // BATCH OPTIMIZATION: Join all inputs with delimiter
    const batchedInputs = testCases.map(tc => tc.input).join(TEST_DELIMITER);
    
    console.log(`[Batch Execution] Batched inputs:`, batchedInputs);
    
    // Wrap user's function with batched test execution code
    const fullCode = langConfig.wrapperTemplate(code);

    try {
      // Single Piston API call for ALL test cases
      const response = await fetch(`${PISTON_API}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: langConfig.language,
          version: langConfig.version,
          files: [
            {
              name: langConfig.filename,
              content: fullCode,
            },
          ],
          stdin: "",
          args: [batchedInputs],
          compile_timeout: 10000,
          run_timeout: 5000, // Slightly longer for batch execution
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Piston API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract output and check for errors
      const stderr = data.run.stderr.trim();
      const exitCode = data.run.code;

      // Check for compile or runtime errors
      if (exitCode !== 0 || stderr) {
        console.error("[Batch Execution] Error:", stderr);
        return NextResponse.json(
          {
            error: "Code execution failed",
            details: stderr || "Runtime error",
          },
          { status: 400 }
        );
      }

      // Split outputs by lines and filter out empty lines
      const rawOutput = data.run.stdout.trim();
      const outputs = rawOutput ? rawOutput.split('\n') : [];

      console.log(`[Batch Execution] Raw stdout:`, data.run.stdout);
      console.log(`[Batch Execution] Got ${outputs.length} outputs for ${testCases.length} test cases`);
      console.log(`[Batch Execution] Outputs:`, outputs);

      // Validate output count matches test case count
      if (outputs.length !== testCases.length) {
        console.error(`[Batch Execution] Output count mismatch: expected ${testCases.length}, got ${outputs.length}`);
        
        // Provide more helpful error message
        let errorDetails = `Expected ${testCases.length} outputs, but got ${outputs.length}.`;
        
        if (outputs.length === 0 || (outputs.length === 1 && outputs[0] === '')) {
          errorDetails += " Your solve() function appears to return empty strings. Make sure you implement the logic and return the correct result.";
        } else if (outputs.length < testCases.length) {
          errorDetails += " Some outputs are missing. Check that your solve() function returns a value for every input.";
        } else {
          errorDetails += " Too many outputs. Make sure your solve() function doesn't print anything extra - only return the result.";
        }
        
        return NextResponse.json(
          {
            error: "Output count mismatch",
            details: errorDetails,
          },
          { status: 400 }
        );
      }

      // Compare outputs with expected results
      const results = [];
      let passed = 0;

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const actualOutput = outputs[i].trim();
        const expectedOutput = testCase.output.trim();
        const isCorrect = actualOutput === expectedOutput;

        if (isCorrect) passed++;

        results.push({
          input: testCase.input,
          expected: expectedOutput,
          actual: actualOutput,
          passed: isCorrect,
        });
      }

      console.log(`[Batch Execution] Results: ${passed}/${testCases.length} passed`);

      return NextResponse.json(
        {
          passed,
          total: testCases.length,
          results,
          success: passed === testCases.length,
        },
        {
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
          }
        }
      );

    } catch (error) {
      console.error("[Batch Execution] Piston API error:", error);
      return NextResponse.json(
        {
          error: "Failed to execute code",
          details: error.message || "Unknown error",
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      {
        error: "Failed to evaluate code",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}