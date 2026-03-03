/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://hungbyxiqfyepyvqaemk.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="MotionlyAI" width="60" height="60" style={logo} />
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password for {siteName}. Click the button below to choose a new one.
        </Text>
        <Button style={button} href={confirmationUrl}>Reset Password</Button>
        <Text style={footer}>
          If you didn't request this, you can safely ignore this email. Your password won't be changed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
const container = { padding: '32px 28px' }
const logo = { margin: '0 0 20px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#1a1f36', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 24px' }
const button = { backgroundColor: '#1DA39A', color: '#ffffff', fontSize: '15px', borderRadius: '8px', padding: '12px 24px', textDecoration: 'none', fontWeight: 'bold' as const }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '32px 0 0' }
