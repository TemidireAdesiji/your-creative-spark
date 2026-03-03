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

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://hungbyxiqfyepyvqaemk.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="MotionlyAI" width="60" height="60" style={logo} />
        <Heading style={h1}>Your login link</Heading>
        <Text style={text}>
          Click the button below to log in to {siteName}. This link will expire shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>Log In</Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
const container = { padding: '32px 28px' }
const logo = { margin: '0 0 20px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#1a1f36', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 24px' }
const button = { backgroundColor: '#1DA39A', color: '#ffffff', fontSize: '15px', borderRadius: '8px', padding: '12px 24px', textDecoration: 'none', fontWeight: 'bold' as const }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '32px 0 0' }
