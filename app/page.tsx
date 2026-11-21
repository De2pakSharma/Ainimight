"use client"

import Ainimight from "@/components/ainimight"
import ClickSpark from "@/components/ClickSpark"

export default function Page() {
  return (
    <ClickSpark sparkColor={["#b0c7dd", "#6f8fb3", "#f7c3b4"]} sparkSize={10} sparkRadius={22} sparkCount={9} duration={480} style={{ height: "auto", minHeight: "100svh" }}>
      <main className="w-full">
        <Ainimight fontHref={null} />
      </main>
    </ClickSpark>
  )
}
