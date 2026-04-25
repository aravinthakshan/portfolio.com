import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { type ReactNode } from 'react'

const fontStack =
  '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
const serifStack = 'Georgia, "Times New Roman", Times, serif'

export const colors = {
  bg: '#fafafa',
  card: '#ffffff',
  border: '#e5e5e5',
  fg: '#0a0a0a',
  muted: '#737373',
  body: '#404040',
  quoteBg: '#f5f5f5',
  link: '#0a0a0a',
}

export function EmailShell({
  preview,
  children,
}: {
  preview: string
  children: ReactNode
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          background: colors.bg,
          margin: 0,
          padding: '32px 16px',
          fontFamily: fontStack,
          color: colors.body,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <Container
          style={{
            background: colors.card,
            maxWidth: 560,
            margin: '0 auto',
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: '36px 36px 28px',
          }}
        >
          {children}
          <Section style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${colors.border}` }}>
            <Text
              style={{
                margin: 0,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: colors.muted,
              }}
            >
              aravinthakshan
            </Text>
            <Text
              style={{
                margin: '6px 0 0',
                fontSize: 12,
                color: colors.muted,
              }}
            >
              <Link href="https://www.linkedin.com/in/aravinthakshan" style={{ color: colors.link, textDecoration: 'underline' }}>
                LinkedIn
              </Link>
              {'  ·  '}
              <Link href="https://github.com/aravinthakshan" style={{ color: colors.link, textDecoration: 'underline' }}>
                GitHub
              </Link>
              {'  ·  '}
              <Link href="mailto:aravinthakshanmain@gmail.com" style={{ color: colors.link, textDecoration: 'underline' }}>
                Email
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const styles = {
  label: {
    margin: 0,
    fontSize: 11,
    letterSpacing: '0.25em',
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
  heading: {
    margin: '8px 0 0',
    fontFamily: serifStack,
    fontSize: 32,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
    color: colors.fg,
    fontWeight: 600,
  },
  intro: {
    margin: '16px 0 0',
    fontSize: 15,
    lineHeight: 1.6,
    color: colors.body,
  },
  sectionLabel: {
    margin: '28px 0 8px',
    fontSize: 10,
    letterSpacing: '0.25em',
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
  quoteBox: {
    background: colors.quoteBg,
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    padding: '14px 16px',
  },
  quoteText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: colors.fg,
    whiteSpace: 'pre-wrap' as const,
  },
  metaRow: {
    margin: '0 0 6px',
    fontSize: 13,
    lineHeight: 1.5,
    color: colors.body,
  },
  metaKey: {
    display: 'inline-block',
    width: 84,
    fontSize: 10,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
}
