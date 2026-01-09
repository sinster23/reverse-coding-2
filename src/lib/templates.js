// lib/templates.js - Standard Challenge Templates

const CODE_TEMPLATES = {
  1: {
    // Challenge 1: Mystery Identity (Single Integer Input)
    javascript: `function solve(input) {
  const n = parseInt(input);
  
  // Your code here
  
  return "";
}`,

    python: `def solve(input):
    n = int(input)
    
    # Your code here
    
    return ""`,

    java: `public static String solve(String input) {
    int n = Integer.parseInt(input.trim());
    
    // Your code here
    
    return "";
}`,

    cpp: `string solve(string input) {
    int n = stoi(input);
    
    // Your code here
    
    return "";
}`,

    c: `char* solve(char* input) {
    int n = atoi(input);
    static char result[100];
    
    // Your code here
    
    return result;
}`,
  },

  2: {
    // Challenge 2: Sequence Squarer (Space-Separated Integers)
    javascript: `function solve(input) {
  const arr = input.trim().split(' ').map(Number);
  
  // Your code here
  
  return "";
}`,

    python: `def solve(input):
    arr = list(map(int, input.strip().split()))
    
    # Your code here
    
    return ""`,

    java: `public static String solve(String input) {
    String[] parts = input.trim().split(" ");
    int[] arr = new int[parts.length];
    for (int i = 0; i < parts.length; i++) {
        arr[i] = Integer.parseInt(parts[i]);
    }
    
    // Your code here
    
    return "";
}`,

    cpp: `string solve(string input) {
    vector<int> arr;
    stringstream ss(input);
    int num;
    while (ss >> num) {
        arr.push_back(num);
    }
    
    // Your code here
    
    return "";
}`,

    c: `char* solve(char* input) {
    int arr[100];
    int size = 0;
    char* token = strtok(input, " ");
    while (token != NULL) {
        arr[size++] = atoi(token);
        token = strtok(NULL, " ");
    }
    static char result[100];
    
    // Your code here
    
    return result;
}`,
  },

  3: {
    // Challenge 3: Digital Root Reveal (Single Integer Input)
    javascript: `function solve(input) {
  const n = parseInt(input);
  
  // Your code here
  
  return "";
}`,

    python: `def solve(input):
    n = int(input)
    
    # Your code here
    
    return ""`,

    java: `public static String solve(String input) {
    int n = Integer.parseInt(input.trim());
    
    // Your code here
    
    return "";
}`,

    cpp: `string solve(string input) {
    int n = stoi(input);
    
    // Your code here
    
    return "";
}`,

    c: `char* solve(char* input) {
    int n = atoi(input);
    static char result[100];
    
    // Your code here
    
    return result;
}`,
  },
};

export default CODE_TEMPLATES;