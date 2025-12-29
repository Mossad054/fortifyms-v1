// Ambient module declarations (only for uppercase extensions not covered by Next's defaults)
// This allows imports like `import img from "@/assets/dashboard.JPG"` to type-check

declare module '*.JPG' {
  const content: any
  export default content
}

declare module '*.PNG' {
  const content: any
  export default content
}
