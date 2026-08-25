export interface TrieNode {
  id: string
  char: string
  isEndOfWord: boolean
  children: Record<string, TrieNode>
}
