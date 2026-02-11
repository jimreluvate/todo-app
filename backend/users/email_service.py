import os
from django.conf import settings
from django.template.loader import render_to_string
from .models import EmailVerificationToken
import resend

resend.api_key = os.getenv('RESEND_API')

def send_verification_email(user):
    """Send verification email to user"""
    try:
        # Create or get verification token
        token, created = EmailVerificationToken.objects.get_or_create(user=user)
        
        if not created:
            # Generate new token if existing one exists
            token.token = token.__class__.objects.model().token.field.default()
            token.is_used = False
            token.save()
        
        # Create verification link
        verification_link = f"http://localhost:3000/verify-email/{token.token}/"
        
        # Send email using Resend
        params = {
            "from": "onboarding@resend.dev",
            "to": [user.email],
            "subject": "Sign Up Verification from Todo App",
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Todo App!</h2>
                    <p>Hi {user.first_name or user.email},</p>
                    <p>Thank you for signing up! Please click the link below to verify your email address and complete your registration:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">{verification_link}</p>
                    <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">Best regards,<br>The Todo App Team</p>
                </div>
            """
        }
        
        result = resend.Emails.send(params)
        return True, result
        
    except Exception as e:
        print(f"Error sending verification email: {e}")
        return False, str(e)

def send_welcome_email(user):
    """Send welcome email after successful verification"""
    try:
        params = {
            "from": "onboarding@resend.dev",
            "to": [user.email],
            "subject": "Welcome to Todo App! 🎉",
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Welcome to Todo App!</h2>
                    <p>Hi {user.first_name or user.email},</p>
                    <p>Your email has been successfully verified! You can now start using Todo App to manage your tasks efficiently.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/todos" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Go to Todo App
                        </a>
                    </div>
                    <p>Features you can enjoy:</p>
                    <ul>
                        <li>Create and manage your todos</li>
                        <li>Set deadlines and reminders</li>
                        <li>Organize tasks by categories</li>
                        <li>Track your progress</li>
                    </ul>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">Best regards,<br>The Todo App Team</p>
                </div>
            """
        }
        
        result = resend.Emails.send(params)
        return True, result
        
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False, str(e)
