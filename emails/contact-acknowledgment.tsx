import { Section, Text } from '@react-email/components'
import { EmailShell, styles } from './_layout'

type Props = {
  name: string
  message: string
}

export function ContactAcknowledgment({ name, message }: Props) {
  const firstName = name.split(/\s+/)[0] || name

  return (
    <EmailShell
      preview={`Got your message — I'll get back within 24 hours, ${firstName}.`}
    >
      <Text style={styles.label}>Contact</Text>
      <Text style={styles.heading}>Got your message.</Text>
      <Text style={styles.intro}>
        Thanks for reaching out, {firstName}. This is just a quick note to
        confirm your message landed in my inbox — I&apos;ll get back to you
        personally, usually within 24 hours.
      </Text>
      <Text style={{ ...styles.intro, color: '#525252' }}>
        No assistants, no routing — just me on the other end.
      </Text>

      <Text style={styles.sectionLabel}>What you sent</Text>
      <Section style={styles.quoteBox}>
        <Text style={styles.quoteText}>{message}</Text>
      </Section>

      <Text style={{ ...styles.intro, fontSize: 13, color: '#737373' }}>
        Replying to this email reaches me directly.
      </Text>
    </EmailShell>
  )
}

export default ContactAcknowledgment
