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
      preview={`Thanks for reaching out, ${firstName} — I&apos;ll reply within 24 hours.`}
    >
      <Text style={styles.label}>Contact</Text>
      <Text style={styles.heading}>Thanks — I&apos;ve got your message.</Text>
      <Text style={styles.intro}>
        Hi {firstName}, thanks for taking the time to write. Your note is in
        my inbox and I&apos;ll read it properly soon. I reply personally to
        every message and aim to get back within 24 hours (often sooner).
      </Text>
      <Text style={{ ...styles.intro, color: '#525252' }}>
        If anything urgent comes up in the meantime, feel free to reply to this
        email — it goes straight to me.
      </Text>

      <Text style={styles.sectionLabel}>What you sent</Text>
      <Section style={styles.quoteBox}>
        <Text style={styles.quoteText}>{message}</Text>
      </Section>

      <Text style={{ ...styles.intro, fontSize: 13, color: '#737373' }}>
        Talk soon — aravinthakshan
      </Text>
    </EmailShell>
  )
}

export default ContactAcknowledgment
