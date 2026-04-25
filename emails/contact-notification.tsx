import { Section, Text } from '@react-email/components'
import { EmailShell, styles } from './_layout'

type Props = {
  name: string
  email: string
  company?: string | null
  message: string
}

export function ContactNotification({ name, email, company, message }: Props) {
  return (
    <EmailShell preview={`New message from ${name} — ${email}`}>
      <Text style={styles.label}>New contact</Text>
      <Text style={styles.heading}>Message from {name}.</Text>
      <Text style={styles.intro}>
        Hit reply to respond directly — the reply threads with the
        acknowledgment they already received.
      </Text>

      <Text style={styles.sectionLabel}>From</Text>
      <Text style={styles.metaRow}>
        <span style={styles.metaKey}>Name</span>
        {name}
      </Text>
      <Text style={styles.metaRow}>
        <span style={styles.metaKey}>Email</span>
        {email}
      </Text>
      {company ? (
        <Text style={styles.metaRow}>
          <span style={styles.metaKey}>Company</span>
          {company}
        </Text>
      ) : null}

      <Text style={styles.sectionLabel}>Message</Text>
      <Section style={styles.quoteBox}>
        <Text style={styles.quoteText}>{message}</Text>
      </Section>
    </EmailShell>
  )
}

export default ContactNotification
