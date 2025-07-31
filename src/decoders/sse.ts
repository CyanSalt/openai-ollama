export interface ServerSentEvent {
  event: string | null,
  data: string,
  raw: string[],
}

export class SSEDecoder {
  private data: string[]
  private event: string | null
  private chunks: string[]

  constructor() {
    this.event = null
    this.data = []
    this.chunks = []
  }

  decode(line: string) {
    if (line.endsWith('\r')) {
      line = line.slice(0, Math.max(0, line.length - 1))
    }

    if (!line) {
      // empty line and we didn't previously encounter any messages
      if (!this.event && !this.data.length) return null

      const sse: ServerSentEvent = {
        event: this.event,
        data: this.data.join('\n'),
        raw: this.chunks,
      }

      this.event = null
      this.data = []
      this.chunks = []

      return sse
    }

    this.chunks.push(line)

    if (line.startsWith(':')) {
      return null
    }

    let [fieldname,, value] = partition(line, ':')

    if (value.startsWith(' ')) {
      value = value.slice(1)
    }

    if (fieldname === 'event') {
      this.event = value
    } else if (fieldname === 'data') {
      this.data.push(value)
    }

    return null
  }
}

function partition(str: string, delimiter: string): [string, string, string] {
  const index = str.indexOf(delimiter)
  if (index !== -1) {
    return [str.slice(0, Math.max(0, index)), delimiter, str.slice(Math.max(0, index + delimiter.length))]
  }

  return [str, '', '']
}
