import toast from 'react-hot-toast'

export type VisaStatus = 'inquiry' | 'application' | 'visa' | 'departure'

const STATUS_MESSAGES: Record<VisaStatus, string> = {
    inquiry: '📋 New inquiry registered',
    application: '📝 Application process started',
    visa: '🛂 Visa stage reached — interview prep required!',
    departure: '✈️ Student ready for departure — final briefing scheduled!',
}

const STATUS_COLORS: Record<VisaStatus, string> = {
    inquiry: '#C5A059',
    application: '#0a3a6b',
    visa: '#1a6b3a',
    departure: '#6b1a6b',
}

export function triggerVisaStatusNotification(leadName: string, newStatus: VisaStatus): void {
    const message = `${leadName}: ${STATUS_MESSAGES[newStatus]}`
    const color = STATUS_COLORS[newStatus]

    // Mock notification - in production this would call Firebase Cloud Functions
    // or send email via SendGrid/Mailgun
    toast.success(message, {
        duration: 5000,
        style: {
            background: '#002147',
            color: '#fff',
            border: `2px solid ${color}`,
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
        },
        iconTheme: {
            primary: color,
            secondary: '#fff',
        },
    })

    // Log to console (mock for production webhook/function)
    console.log('[ERI Notification]', {
        type: 'VISA_STATUS_UPDATE',
        lead: leadName,
        newStatus,
        timestamp: new Date().toISOString(),
        message,
        // In production: webhook to admin email, WhatsApp API, or Firebase Cloud Function
    })
}

export function triggerNewLeadNotification(leadName: string, country: string): void {
    toast.success(`🎯 New lead: ${leadName} interested in ${country}`, {
        duration: 4000,
        style: {
            background: '#002147',
            color: '#fff',
            border: '2px solid #C5A059',
            borderRadius: '12px',
        },
    })

    console.log('[ERI Notification]', {
        type: 'NEW_LEAD',
        lead: leadName,
        country,
        timestamp: new Date().toISOString(),
    })
}
