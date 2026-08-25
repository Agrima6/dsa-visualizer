"use client"

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-violet-500/15 bg-white/70 p-6 shadow-[0_10px_35px_rgba(139,92,246,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

export function TrieUnderstand() {
  return (
    <div className="space-y-6">
      <Card title="What is a Trie?">
        <p>
          A trie (from re<strong>trie</strong>val, pronounced "try") is a tree where
          each edge is labeled with one character, and every path from the root spells
          out a prefix. Words that share a prefix share the same path — "cat" and "car"
          branch apart only after the shared "ca".
        </p>
        <p>
          A small dot marks any node where a real word ends — that's how the trie tells
          "car" (a full word) apart from "ca" (just a prefix that happens to lead
          somewhere), even though both are valid paths through the same tree.
        </p>
      </Card>

      <Card title="Insert, Search, Prefix">
        <p>
          <strong>Insert</strong> walks the word character by character, creating a new
          node only when the path doesn't already exist, then flags the last node as
          end-of-word. <strong>Search</strong> walks the same path and only succeeds if
          it reaches a node flagged end-of-word. <strong>Prefix search</strong> (used
          for autocomplete) succeeds as soon as the path exists at all — the last node
          doesn't need to be a real word.
        </p>
      </Card>

      <Card title="Why not just use a hash set?">
        <p>
          A hash set answers "is this exact word present?" in O(1), but can't answer
          "what words start with 'ca'?" without scanning everything. A trie answers
          both in O(word length) — the shared-prefix structure <em>is</em> the index.
          That's why every autocomplete box, spell-checker, and IP-routing table under
          the hood reaches for a trie instead of a hash set.
        </p>
      </Card>

      <Card title="Complexity">
        <p>
          Insert, search, and prefix search are all O(L) where L is the length of the
          word — independent of how many words are already stored. The cost is space:
          a trie can use more memory than a hash set because every shared prefix is
          stored once, but every unique branch still needs its own node.
        </p>
      </Card>
    </div>
  )
}
