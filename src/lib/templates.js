const CODE_TEMPLATES = {
  1: {
    // Challenge 1: Mystery Sum (Single Integer Input)
    javascript: `function solve(input) {
  // input: a string containing a single integer (e.g., "5")
  // output: return result as a string
  
  const n = parseInt(input);
  
  // Your code here
  
  return "";
}`,

    python: `def solve(input):
    # input: a string containing a single integer (e.g., "5")
    # output: return result as a string
    
    n = int(input)
    
    # Your code here
    
    return ""`,

    java: `public static String solve(String input) {
    // input: a string containing a single integer (e.g., "5")
    // output: return result as a string
    
    int n = Integer.parseInt(input.trim());
    
    // Your code here
    
    return "";
}`,

    cpp: `string solve(string input) {
    // input: a string containing a single integer (e.g., "5")
    // output: return result as a string
    
    int n = stoi(input);
    
    // Your code here
    
    return "";
}`,

    c: `char* solve(char* input) {
    // input: a string containing a single integer (e.g., "5")
    // output: return result as a string
    
    int n = atoi(input);
    
    // Your code here
    
    static char result[32];
    return result;
}`,
  },

    2: {
    // Challenge 3: Number Transformer (Single Integer Input)
    javascript: `function solve(input) {
  // input: a string containing a single integer (e.g., "6")
  // output: return result as a string
  
  const n = parseInt(input);
  
  // Your code here
  
  return "";
}`,

    python: `def solve(input):
    # input: a string containing a single integer (e.g., "6")
    # output: return result as a string
    
    n = int(input)
    
    # Your code here
    
    return ""`,

    java: `public static String solve(String input) {
    // input: a string containing a single integer (e.g., "6")
    // output: return result as a string
    
    int n = Integer.parseInt(input.trim());
    
    // Your code here
    
    return "";
}`,

    cpp: `string solve(string input) {
    // input: a string containing a single integer (e.g., "6")
    // output: return result as a string
    
    int n = stoi(input);
    
    // Your code here
    
    return "";
}`,

    c: `char* solve(char* input) {
    // input: a string containing a single integer (e.g., "6")
    // output: return result as a string
    
    int n = atoi(input);
    
    // Your code here
    
    static char result[32];
    return result;
}`,
  },

  3: {
    // Challenge 2: Array Mystery (Space-Separated Integers)
    javascript: `function solve(input) {
  // input: space-separated integers (e.g., "3 1 4 2 5")
  // output: return result as a string
  
  const arr = input.trim().split(' ').map(Number);
  
  // Your code here
  
  return "";
}`,

    python: `def solve(input):
    # input: space-separated integers (e.g., "3 1 4 2 5")
    # output: return result as a string
    
    arr = list(map(int, input.strip().split()))
    
    # Your code here
    
    return ""`,

    java: `public static String solve(String input) {
    // input: space-separated integers (e.g., "3 1 4 2 5")
    // output: return result as a string
    
    String[] parts = input.trim().split(" ");
    int[] arr = new int[parts.length];
    for (int i = 0; i < parts.length; i++) {
        arr[i] = Integer.parseInt(parts[i]);
    }
    
    // Your code here
    
    return "";
}`,

    cpp: `string solve(string input) {
    // input: space-separated integers (e.g., "3 1 4 2 5")
    // output: return result as a string
    
    vector<int> arr;
    istringstream iss(input);
    int num;
    while (iss >> num) {
        arr.push_back(num);
    }
    
    // Your code here
    
    return "";
}`,

    c: `char* solve(char* input) {
    // input: space-separated integers (e.g., "3 1 4 2 5")
    // output: return result as a string
    
    int arr[100];
    int count = 0;
    char* token = strtok(input, " ");
    while (token != NULL) {
        arr[count++] = atoi(token);
        token = strtok(NULL, " ");
    }
    
    // Your code here
    
    static char result[32];
    return result;
}`,
  },
};

export default CODE_TEMPLATES;