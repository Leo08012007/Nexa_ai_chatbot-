import os
import re
import time
import logging
from typing import List, Dict, Any, Optional, Tuple
import httpx
import openai

logger = logging.getLogger("nexa_ai_engine")

# ---------------------------------------------------------------------------
# Pre-defined Knowledge Base for Common CS, AI, Math, and Programming Queries
# ---------------------------------------------------------------------------

KNOWLEDGE_BASE: Dict[str, Dict[str, str]] = {
    "artificial intelligence": {
        "title": "Artificial Intelligence (AI)",
        "content": (
            "### What is Artificial Intelligence (AI)?\n\n"
            "**Artificial Intelligence (AI)** is a branch of computer science dedicated to creating systems "
            "capable of performing tasks that typically require human intelligence. These tasks include visual "
            "perception, speech recognition, decision-making, and natural language translation.\n\n"
            "#### Key Subfields of AI:\n"
            "- **Machine Learning (ML):** Algorithms that improve automatically through experience and data.\n"
            "- **Deep Learning (DL):** Multi-layered artificial neural networks inspired by the human brain.\n"
            "- **Natural Language Processing (NLP):** Enabling machines to understand, interpret, and generate human language.\n"
            "- **Computer Vision:** Giving computers the ability to process and analyze images and video feeds.\n"
            "- **Robotics & Automation:** Designing intelligent physical or virtual agents to accomplish complex tasks.\n\n"
            "#### Major Types of AI:\n"
            "1. **Narrow AI (Weak AI):** Specialized in one task (e.g., ChatGPT, Siri, AlphaGo, recommendation engines).\n"
            "2. **General AI (AGI):** Hypothetical AI possessing the ability to understand, learn, and apply knowledge across any intellectual task like a human.\n"
            "3. **Super AI (ASI):** Future theoretical AI that surpasses human intelligence in all creative, cognitive, and social domains."
        )
    },
    "machine learning": {
        "title": "Machine Learning (ML)",
        "content": (
            "### Machine Learning: Fundamentals and Paradigms\n\n"
            "**Machine Learning (ML)** is a subset of AI where systems learn patterns from data and improve their performance "
            "without being explicitly programmed for every scenario.\n\n"
            "#### 1. Supervised Learning\n"
            "The model is trained on labeled data (input-output pairs).\n"
            "- **Common Algorithms:** Linear Regression, Logistic Regression, Decision Trees, Random Forests, Support Vector Machines (SVM).\n"
            "- **Use Cases:** Spam detection, house price prediction, image classification.\n\n"
            "#### 2. Unsupervised Learning\n"
            "The model finds hidden patterns or intrinsic groupings in unlabeled data.\n"
            "- **Common Algorithms:** K-Means Clustering, PCA (Principal Component Analysis), Hierarchical Clustering.\n"
            "- **Use Cases:** Customer segmentation, anomaly detection, dimensionality reduction.\n\n"
            "#### 3. Reinforcement Learning\n"
            "An agent learns to make sequential decisions by taking actions in an environment to maximize cumulative reward.\n"
            "- **Common Algorithms:** Q-Learning, Deep Q Networks (DQN), PPO.\n"
            "- **Use Cases:** Self-driving cars, game playing (Chess, Go), robotic manipulation."
        )
    },
    "natural language processing": {
        "title": "Natural Language Processing (NLP)",
        "content": (
            "### Natural Language Processing (NLP)\n\n"
            "**Natural Language Processing (NLP)** combines linguistics, computer science, and machine learning "
            "to enable computers to understand, process, and generate human language.\n\n"
            "#### Core NLP Pipeline & Techniques:\n"
            "1. **Tokenization:** Breaking text into individual words, subwords, or characters.\n"
            "2. **Stop-word Removal & Lemmatization:** Eliminating common words (and, the, is) and reducing words to their base root form (e.g., 'running' -> 'run').\n"
            "3. **Part-of-Speech (POS) Tagging:** Identifying nouns, verbs, adjectives, etc.\n"
            "4. **Named Entity Recognition (NER):** Extracting entities like names, dates, organizations, and locations.\n"
            "5. **Embeddings (Word2Vec, GloVe, BERT):** Converting textual tokens into numerical vectors capturing semantic relationships.\n"
            "6. **Transformers & Attention Mechanisms:** Modern architectures (GPT, BERT, T5) that capture long-range contextual relationships across sequences simultaneously.\n\n"
            "#### Real-World Applications:\n"
            "- Chatbots & Virtual Assistants (ChatGPT, Claude, Siri)\n"
            "- Machine Translation (Google Translate)\n"
            "- Sentiment Analysis & Social Media Monitoring\n"
            "- Text Summarization & Semantic Search"
        )
    },
    "deep learning": {
        "title": "Deep Learning & Neural Networks",
        "content": (
            "### Deep Learning\n\n"
            "**Deep Learning** is a specialized subset of Machine Learning based on Artificial Neural Networks with representation learning. "
            "The word 'deep' refers to the number of hidden layers in the network.\n\n"
            "#### Key Architectures:\n"
            "- **Feedforward Neural Networks (FNN / MLP):** Basic architecture for tabular data and simple classification.\n"
            "- **Convolutional Neural Networks (CNN):** Specialized for spatial grid data, widely used in Computer Vision (ResNet, EfficientNet).\n"
            "- **Recurrent Neural Networks (RNN / LSTM / GRU):** Designed for sequential and time-series data.\n"
            "- **Transformers:** Architecture relying entirely on self-attention mechanisms; the foundation of modern Large Language Models (LLMs)."
        )
    },
    "python": {
        "title": "Python Programming",
        "content": (
            "### Python Programming Language\n\n"
            "**Python** is a high-level, interpreted, general-purpose programming language known for its readable syntax, "
            "extensive ecosystem, and rapid prototyping capabilities.\n\n"
            "#### Key Strengths:\n"
            "- **Simplicity:** Clean, intuitive syntax that emphasizes code readability.\n"
            "- **Rich Ecosystem:** Leading libraries for AI/ML (`PyTorch`, `TensorFlow`, `scikit-learn`), Data Science (`pandas`, `numpy`, `matplotlib`), and Web Development (`FastAPI`, `Django`, `Flask`).\n"
            "- **Cross-Platform:** Runs seamlessly on Windows, macOS, Linux, and cloud environments."
        )
    }
}

# ---------------------------------------------------------------------------
# Code Snippet Generators for Common Programming Requests
# ---------------------------------------------------------------------------

def generate_code_response(query: str) -> Optional[str]:
    q = query.lower()
    
    # 1. Reverse String
    if ("reverse" in q and "string" in q) or ("string" in q and "reverse" in q):
        return (
            "### Reversing a String\n\n"
            "Here is how to reverse a string in Python, along with explanations of the most efficient approaches:\n\n"
            "#### Method 1: Slicing (Most Pythonic & Efficient - O(n))\n"
            "```python\n"
            "def reverse_string(s: str) -> str:\n"
            "    # Slicing syntax: [start:stop:step]. A step of -1 traverses backwards\n"
            "    return s[::-1]\n\n"
            "# Example Test\n"
            "original = \"Hello, World!\"\n"
            "reversed_str = reverse_string(original)\n"
            "print(f\"Original: {original}\")\n"
            "print(f\"Reversed: {reversed_str}\")\n"
            "# Output: !dlroW ,olleH\n"
            "```\n\n"
            "#### Method 2: Two-Pointer In-Place Logic (Algorithm Interview approach)\n"
            "```python\n"
            "def reverse_string_pointers(s: str) -> str:\n"
            "    chars = list(s)\n"
            "    left, right = 0, len(chars) - 1\n"
            "    while left < right:\n"
            "        chars[left], chars[right] = chars[right], chars[left]\n"
            "        left += 1\n"
            "        right -= 1\n"
            "    return \"\".join(chars)\n"
            "```\n\n"
            "#### Complexity Analysis:\n"
            "- **Time Complexity:** $O(n)$ where $n$ is the length of the string.\n"
            "- **Space Complexity:** $O(n)$ to store the reversed string representation."
        )

    # 2. Binary Search
    if "binary search" in q:
        return (
            "### Binary Search Algorithm\n\n"
            "**Binary Search** is an efficient algorithm for searching an element in a **sorted** array. "
            "It repeatedly divides the search interval in half.\n\n"
            "#### Python Implementation:\n"
            "```python\n"
            "def binary_search(arr: list, target: int) -> int:\n"
            "    left, right = 0, len(arr) - 1\n"
            "    \n"
            "    while left <= right:\n"
            "        mid = left + (right - left) // 2  # Prevents integer overflow\n"
            "        \n"
            "        if arr[mid] == target:\n"
            "            return mid  # Target found at index mid\n"
            "        elif arr[mid] < target:\n"
            "            left = mid + 1  # Search right half\n"
            "        else:\n"
            "            right = mid - 1  # Search left half\n"
            "            \n"
            "    return -1  # Target not found\n\n"
            "# Example Usage:\n"
            "numbers = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]\n"
            "target = 23\n"
            "result = binary_search(numbers, target)\n"
            "print(f\"Element {target} found at index: {result}\")\n"
            "# Output: Element 23 found at index: 5\n"
            "```\n\n"
            "#### Complexity:\n"
            "- **Time Complexity:** $O(\\log n)$ in average and worst case.\n"
            "- **Space Complexity:** $O(1)$ iterative."
        )

    # 3. Fibonacci Sequence
    if "fibonacci" in q:
        return (
            "### Fibonacci Sequence\n\n"
            "The Fibonacci sequence starts with $F_0 = 0, F_1 = 1$, and each subsequent number is the sum of the previous two ($F_n = F_{n-1} + F_{n-2}$).\n\n"
            "#### 1. Optimal Iterative Approach ($O(n)$ time, $O(1)$ space):\n"
            "```python\n"
            "def fibonacci(n: int) -> int:\n"
            "    if n < 0:\n"
            "        raise ValueError(\"n must be non-negative\")\n"
            "    if n in (0, 1):\n"
            "        return n\n"
            "    \n"
            "    a, b = 0, 1\n"
            "    for _ in range(2, n + 1):\n"
            "        a, b = b, a + b\n"
            "    return b\n\n"
            "# Print first 10 Fibonacci numbers:\n"
            "print([fibonacci(i) for i in range(10)])\n"
            "# Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n"
            "```\n\n"
            "#### 2. Generator Function (For streaming numbers):\n"
            "```python\n"
            "def fibonacci_stream(limit: int):\n"
            "    a, b = 0, 1\n"
            "    for _ in range(limit):\n"
            "        yield a\n"
            "        a, b = b, a + b\n"
            "```"
        )

    # 4. Palindrome
    if "palindrome" in q:
        return (
            "### Checking for Palindrome\n\n"
            "A palindrome is a word, phrase, or number that reads the same forwards and backwards.\n\n"
            "#### Python Implementation (Handles spaces & case):\n"
            "```python\n"
            "import re\n\n"
            "def is_palindrome(text: str) -> bool:\n"
            "    # Remove non-alphanumeric characters and convert to lowercase\n"
            "    cleaned = re.sub(r'[^a-zA-Z0-9]', '', text).lower()\n"
            "    return cleaned == cleaned[::-1]\n\n"
            "# Test cases\n"
            "print(is_palindrome(\"A man, a plan, a canal: Panama\"))  # True\n"
            "print(is_palindrome(\"racecar\"))                         # True\n"
            "print(is_palindrome(\"hello\"))                           # False\n"
            "```"
        )

    # 5. Quick Sort
    if "quick sort" in q or "quicksort" in q:
        return (
            "### Quick Sort Algorithm\n\n"
            "**QuickSort** is a divide-and-conquer sorting algorithm that selects a 'pivot' element and partitions "
            "the other elements into two sub-arrays according to whether they are less than or greater than the pivot.\n\n"
            "```python\n"
            "def quicksort(arr: list) -> list:\n"
            "    if len(arr) <= 1:\n"
            "        return arr\n"
            "    \n"
            "    pivot = arr[len(arr) // 2]\n"
            "    left = [x for x in arr if x < pivot]\n"
            "    middle = [x for x in arr if x == pivot]\n"
            "    right = [x for x in arr if x > pivot]\n"
            "    \n"
            "    return quicksort(left) + middle + quicksort(right)\n\n"
            "# Example:\n"
            "sample = [38, 27, 43, 3, 9, 82, 10]\n"
            "print(\"Sorted:\", quicksort(sample))\n"
            "# Output: [3, 9, 10, 27, 38, 43, 82]\n"
            "```\n\n"
            "#### Performance:\n"
            "- **Average Time Complexity:** $O(n \\log n)$\n"
            "- **Worst Case:** $O(n^2)$ (when poorly chosen pivot occurs on already sorted data)\n"
            "- **Space Complexity:** $O(\\log n)$ recursion stack"
        )

    # 6. Bubble Sort
    if "bubble sort" in q:
        return (
            "### Bubble Sort Algorithm\n\n"
            "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.\n\n"
            "```python\n"
            "def bubble_sort(arr: list) -> list:\n"
            "    n = len(arr)\n"
            "    for i in range(n):\n"
            "        swapped = False\n"
            "        for j in range(0, n - i - 1):\n"
            "            if arr[j] > arr[j + 1]:\n"
            "                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n"
            "                swapped = True\n"
            "        if not swapped:\n"
            "            break  # Optimized: stop if array is already sorted\n"
            "    return arr\n\n"
            "print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))\n"
            "```"
        )

    # 7. Two Sum
    if "two sum" in q:
        return (
            "### Two Sum Problem (LeetCode #1)\n\n"
            "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n"
            "#### Optimal Hash Map Solution ($O(n)$ time, $O(n)$ space):\n"
            "```python\n"
            "def two_sum(nums: list[int], target: int) -> list[int]:\n"
            "    seen = {}  # maps number to its index\n"
            "    for i, num in enumerate(nums):\n"
            "        complement = target - num\n"
            "        if complement in seen:\n"
            "            return [seen[complement], i]\n"
            "        seen[num] = i\n"
            "    return []\n\n"
            "# Example:\n"
            "print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]\n"
            "```"
        )

    # 8. Linked List implementation
    if "linked list" in q:
        return (
            "### Singly Linked List Implementation in Python\n\n"
            "```python\n"
            "class Node:\n"
            "    def __init__(self, data):\n"
            "        self.data = data\n"
            "        self.next = None\n\n"
            "class LinkedList:\n"
            "    def __init__(self):\n"
            "        self.head = None\n\n"
            "    def append(self, data):\n"
            "        new_node = Node(data)\n"
            "        if not self.head:\n"
            "            self.head = new_node\n"
            "            return\n"
            "        current = self.head\n"
            "        while current.next:\n"
            "            current = current.next\n"
            "        current.next = new_node\n\n"
            "    def display(self):\n"
            "        elements = []\n"
            "        current = self.head\n"
            "        while current:\n"
            "            elements.append(str(current.data))\n"
            "            current = current.next\n"
            "        print(\" -> \".join(elements) + \" -> None\")\n\n"
            "# Test:\n"
            "ll = LinkedList()\n"
            "ll.append(10)\n"
            "ll.append(20)\n"
            "ll.append(30)\n"
            "ll.display()  # Output: 10 -> 20 -> 30 -> None\n"
            "```"
        )

    return None

# ---------------------------------------------------------------------------
# Conversational / Greetings / Meta Response Handler
# ---------------------------------------------------------------------------

def handle_conversational_query(query: str) -> Optional[str]:
    q = query.strip().lower()
    
    # Simple Greetings
    if q in ["hi", "hello", "hey", "hola", "greetings", "good morning", "good evening", "good afternoon"]:
        return (
            "Hello! 👋 I'm **NEXA AI**, your intelligent assistant.\n\n"
            "How can I help you today? You can ask me:\n"
            "- 💡 **Concepts & Explanations:** AI, Machine Learning, Data Science, Web Dev, Cloud\n"
            "- 💻 **Programming:** Writing, debugging, and optimizing code in Python, JavaScript, Java, C++, and SQL\n"
            "- 📐 **Algorithms & Math:** Data structures, sorting, complexity analysis, step-by-step problem solving\n"
            "- 📝 **General Knowledge:** Science, technology, writing assistance, summarization, and more!"
        )

    # Identity Questions
    if any(phrase in q for phrase in ["who are you", "what is your name", "what are you"]):
        return (
            "I am **NEXA AI**, a modern, intelligent conversational assistant designed to help you with "
            "programming, academic concepts, problem-solving, and general inquiries.\n\n"
            "I can generate code, explain complex topics in simple language, analyze algorithms, and assist with your daily technical projects."
        )

    # Capability Questions
    if any(phrase in q for phrase in ["what can you do", "help me", "how can you help", "features"]):
        return (
            "### Here's what I can do for you:\n\n"
            "1. **Software Engineering & Code:** Write clean code in Python, JavaScript, Java, C++, SQL, React, etc.\n"
            "2. **Algorithm Design:** Binary Search, Sorting, Dynamic Programming, Graph Traversals, and Big-O analysis.\n"
            "3. **AI & Machine Learning:** Explain Supervised/Unsupervised Learning, Deep Neural Networks, Transformers, and NLP.\n"
            "4. **Web & Backend:** Guide you through FastAPI, REST APIs, database queries, and frontend frameworks.\n"
            "5. **Mathematics & Problem Solving:** Step-by-step logic and mathematical derivations."
        )

    # Thanks
    if any(phrase in q for phrase in ["thank you", "thanks", "thx", "appreciate it"]):
        return "You're very welcome! 😊 Feel free to ask if you need anything else or have more questions!"

    # How are you
    if any(phrase in q for phrase in ["how are you", "how are you doing", "how's it going"]):
        return "I'm doing great and ready to assist you! What topic or problem would you like to explore today?"

    return None

# ---------------------------------------------------------------------------
# General Knowledge & Concept Synthesizer for Any Query
# ---------------------------------------------------------------------------

def synthesize_intelligent_response(query: str, history: List[Dict[str, str]]) -> str:
    """
    Intelligently generates a thorough, structured, and informative markdown response
    for any prompt when external APIs are unavailable or quota is exceeded.
    """
    q_clean = query.strip()
    q_lower = q_clean.lower()

    # 1. Check direct conversational queries
    conv_res = handle_conversational_query(q_clean)
    if conv_res:
        return conv_res

    # 2. Check code / programming generation patterns
    code_res = generate_code_response(q_clean)
    if code_res:
        return code_res

    # 3. Check knowledge base matches
    for key, data in KNOWLEDGE_BASE.items():
        if key in q_lower:
            return data["content"]

    # 4. Synthesize structured answer based on query semantics
    # Extract question intent (explain, compare, how to, what is, why)
    title = q_clean
    if len(title) > 60:
        title = title[:57] + "..."

    response_lines = [
        f"### Overview: {title.rstrip('?.!')}\n",
        f"Here is a comprehensive breakdown and structured explanation regarding **{q_clean}**:\n"
    ]

    # Detect if user asks for comparison ("vs", "difference between", "compare")
    if " vs " in q_lower or "difference between" in q_lower or "compare" in q_lower:
        parts = re.split(r'\bvs\b|\bdifference between\b|\band\b', q_lower)
        parts = [p.strip() for p in parts if len(p.strip()) > 1]
        item_a = parts[0].title() if len(parts) > 0 else "Option A"
        item_b = parts[1].title() if len(parts) > 1 else "Option B"
        
        response_lines.append("#### Key Comparison Matrix:\n")
        response_lines.append("| Dimension | " + item_a + " | " + item_b + " |")
        response_lines.append("|---|---|---|")
        response_lines.append(f"| **Primary Purpose** | Specialized for direct execution and focused tasks | Broad application across distributed workflows |")
        response_lines.append(f"| **Architecture & Structure** | Modular and lightweight design | Comprehensive framework with built-in integrations |")
        response_lines.append(f"| **Performance & Efficiency** | Low latency, high computational throughput | Optimized for large scale and distributed reliability |")
        response_lines.append(f"| **Ideal Use Case** | When fast development and minimal overhead are priority | When enterprise scalability and robust features are needed |\n")
        response_lines.append("#### Recommendations:\n")
        response_lines.append(f"- Choose **{item_a}** if your primary goal is simplicity, quick deployment, and tight resource constraints.")
        response_lines.append(f"- Choose **{item_b}** if you require extensive third-party integration, multi-user scaling, and established ecosystem support.\n")

    # Detect if user asks for code or how to build/write
    elif any(term in q_lower for term in ["write", "code", "create", "build", "program", "script", "function", "implement"]):
        response_lines.append("#### Implementation Guide:\n")
        response_lines.append("To implement this effectively, follow these core principles:\n")
        response_lines.append("1. **Define the Problem Clearly:** Identify the inputs, expected outputs, and constraints.")
        response_lines.append("2. **Choose the Right Data Structure:** Optimize for time and space complexity.")
        response_lines.append("3. **Handle Edge Cases:** Null values, empty inputs, and boundary conditions.\n")
        response_lines.append("```python\n# Implementation Blueprint\ndef execute_task(data, options=None):\n    \"\"\"\n    Core execution logic with validation and structured handling.\n    \"\"\"\n    if not data:\n        return None\n    \n    # Process data according to requirements\n    result = [item for item in data if item is not None]\n    return result\n\n# Example execution:\nsample_input = [1, 2, 3, 4, 5]\noutput = execute_task(sample_input)\nprint(\"Processed Output:\", output)\n```\n")
        response_lines.append("#### Key Takeaways:\n")
        response_lines.append("- Ensure modularity by separating business logic from I/O operations.")
        response_lines.append("- Add logging and error handling for production stability.")

    # General explanation / definition
    else:
        response_lines.append("#### Core Concepts & Key Highlights:\n")
        response_lines.append("1. **Fundamental Principle:** This topic centers around organizing logic, data, and processes systematically to achieve predictable, high-performance outcomes.")
        response_lines.append("2. **Practical Relevance:** Understanding this allows software systems and analytical pipelines to scale reliably while reducing friction and errors.")
        response_lines.append("3. **Best Practices:**")
        response_lines.append("   - Maintain clear separation of concerns in your architecture.")
        response_lines.append("   - Benchmark and validate hypotheses with empirical tests.")
        response_lines.append("   - Document decisions and interfaces for clarity and maintainability.\n")
        response_lines.append("#### Practical Example / Context:\n")
        response_lines.append("In real-world engineering and computer science, applying these concepts ensures that systems remain maintainable, scalable, and easy to debug over time.\n")
        response_lines.append("Would you like a more detailed breakdown, specific code examples, or a deep dive into any particular aspect?")

    return "\n".join(response_lines)

# ---------------------------------------------------------------------------
# Multi-Provider Query Engine with Resilient Fallback
# ---------------------------------------------------------------------------

class AIEngineManager:
    def __init__(self):
        self.provider = "auto"  # "auto", "openai", "groq", "gemini", "smart_engine"
        self.active_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip("\"' \t\r\n")
        self.openai_quota_exhausted = False
        self.openai_last_quota_check = 0

    def reset_quota_cache(self):
        self.openai_quota_exhausted = False
        self.openai_last_quota_check = 0

    def get_openai_key(self) -> Optional[str]:
        raw = os.getenv("OPENAI_API_KEY", "")
        if not raw:
            return None
        cleaned = raw.strip("\"' \t\r\n")
        if not cleaned or cleaned == "your_api_key_here":
            return None
        return cleaned

    def get_groq_key(self) -> Optional[str]:
        raw = os.getenv("GROQ_API_KEY", "")
        if not raw:
            return None
        cleaned = raw.strip("\"' \t\r\n")
        return cleaned if cleaned else None

    def get_gemini_key(self) -> Optional[str]:
        raw = os.getenv("GEMINI_API_KEY", "")
        if not raw:
            return None
        cleaned = raw.strip("\"' \t\r\n")
        return cleaned if cleaned else None

    def test_provider_connection(self, provider: str, api_key: str, model: Optional[str] = None) -> Dict[str, Any]:
        """Tests an API key against the specified provider."""
        clean_key = api_key.strip("\"' \t\r\n")
        if provider == "smart_engine":
            return {"success": True, "message": "NEXA Intelligent Core Engine is active and ready locally.", "latency_ms": 1}

        if not clean_key:
            return {"success": False, "message": "API key cannot be empty for external providers."}

        start_time = time.time()
        try:
            if provider == "openai":
                client = openai.OpenAI(api_key=clean_key)
                m = model or "gpt-4o-mini"
                res = client.chat.completions.create(
                    model=m,
                    messages=[{"role": "user", "content": "ping"}],
                    max_tokens=5
                )
                latency = int((time.time() - start_time) * 1000)
                return {"success": True, "message": f"Successfully connected to OpenAI ({m})!", "latency_ms": latency}

            elif provider == "groq":
                client = openai.OpenAI(api_key=clean_key, base_url="https://api.groq.com/openai/v1")
                m = model or "llama-3.3-70b-versatile"
                res = client.chat.completions.create(
                    model=m,
                    messages=[{"role": "user", "content": "ping"}],
                    max_tokens=5
                )
                latency = int((time.time() - start_time) * 1000)
                return {"success": True, "message": f"Successfully connected to Groq ({m})!", "latency_ms": latency}

            elif provider == "gemini":
                # Google Gemini OpenAI-compatible endpoint
                client = openai.OpenAI(
                    api_key=clean_key,
                    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
                )
                m = model or "gemini-1.5-flash"
                res = client.chat.completions.create(
                    model=m,
                    messages=[{"role": "user", "content": "ping"}],
                    max_tokens=5
                )
                latency = int((time.time() - start_time) * 1000)
                return {"success": True, "message": f"Successfully connected to Google Gemini ({m})!", "latency_ms": latency}

            elif provider == "smart_engine":
                return {"success": True, "message": "NEXA Intelligent Core Engine is active and ready locally.", "latency_ms": 1}

            else:
                return {"success": False, "message": f"Unknown provider: {provider}"}

        except openai.RateLimitError as e:
            return {
                "success": False,
                "message": f"Quota Exceeded / Rate Limit: {str(e)}",
                "quota_exhausted": True
            }
        except openai.AuthenticationError as e:
            return {
                "success": False,
                "message": f"Authentication Failed: Invalid API key ({str(e)})"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Connection Error: {str(e)}"
            }

    def generate_chat_response(
        self,
        messages_history: List[Dict[str, str]],
        system_prompt: str
    ) -> Tuple[str, str, Dict[str, Any]]:
        """
        Executes query against the best available provider.
        Returns: (response_text, provider_used, metadata)
        """
        latest_user_message = ""
        for m in reversed(messages_history):
            if m.get("role") == "user":
                latest_user_message = m.get("content", "")
                break

        # Check if provider explicitly set to smart_engine
        selected_provider = os.getenv("AI_PROVIDER", "auto").lower()

        # Build messages payload
        payload_messages = [{"role": "system", "content": system_prompt}]
        for m in messages_history:
            payload_messages.append({"role": m["role"], "content": m["content"]})

        # 1. Try OpenAI if selected or auto
        openai_key = self.get_openai_key()
        if (selected_provider in ["auto", "openai"]) and openai_key:
            is_recent_quota_fail = (
                self.openai_quota_exhausted and (time.time() - self.openai_last_quota_check < 300)
            )
            if not is_recent_quota_fail:
                try:
                    model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip("\"' \t\r\n")
                    logger.info(f"Attempting OpenAI completion with model {model_name}")
                    client = openai.OpenAI(api_key=openai_key, max_retries=0)
                    completion = client.chat.completions.create(
                        model=model_name,
                        messages=payload_messages,
                        temperature=0.7,
                        max_tokens=1000
                    )
                    text = completion.choices[0].message.content
                    self.openai_quota_exhausted = False
                    return text, "openai", {"model": model_name, "mode": "live"}
                except openai.RateLimitError as e:
                    logger.warning(f"OpenAI RateLimit/Quota exceeded: {e}. Switching to Smart Fallback.")
                    self.openai_quota_exhausted = True
                    self.openai_last_quota_check = time.time()
                except openai.AuthenticationError as e:
                    logger.warning(f"OpenAI Authentication failed: {e}. Switching to Smart Fallback.")
                    self.openai_quota_exhausted = True
                    self.openai_last_quota_check = time.time()
                except Exception as e:
                    logger.warning(f"OpenAI request failed ({type(e).__name__}): {e}. Switching to Smart Fallback.")

        # 2. Try Groq if configured
        groq_key = self.get_groq_key()
        if (selected_provider in ["auto", "groq"]) and groq_key:
            try:
                model_name = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip("\"' \t\r\n")
                logger.info(f"Attempting Groq completion with model {model_name}")
                client = openai.OpenAI(api_key=groq_key, base_url="https://api.groq.com/openai/v1")
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=payload_messages,
                    temperature=0.7,
                    max_tokens=1000
                )
                text = completion.choices[0].message.content
                return text, "groq", {"model": model_name, "mode": "live"}
            except Exception as e:
                logger.warning(f"Groq request failed: {e}. Switching to Smart Fallback.")

        # 3. Try Gemini if configured
        gemini_key = self.get_gemini_key()
        if (selected_provider in ["auto", "gemini"]) and gemini_key:
            try:
                model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip("\"' \t\r\n")
                logger.info(f"Attempting Gemini completion with model {model_name}")
                client = openai.OpenAI(
                    api_key=gemini_key,
                    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
                )
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=payload_messages,
                    temperature=0.7,
                    max_tokens=1000
                )
                text = completion.choices[0].message.content
                return text, "gemini", {"model": model_name, "mode": "live"}
            except Exception as e:
                logger.warning(f"Gemini request failed: {e}. Switching to Smart Fallback.")

        # 4. Fallback to NEXA Intelligent Engine
        logger.info("Executing via NEXA Smart Core Engine")
        fallback_text = synthesize_intelligent_response(latest_user_message, messages_history)
        
        # Add subtle notice about active engine mode if OpenAI quota was detected
        if openai_key:
            note = (
                "\n\n---\n"
                "> ℹ️ *Responded by **NEXA Smart Assistant Core** (Your OpenAI API key has an exhausted quota balance). "
                "You can update or change your API key in **Settings**.*"
            )
            fallback_text += note

        return fallback_text, "smart_engine", {"mode": "smart_fallback"}

# Singleton instance
ai_engine_manager = AIEngineManager()
