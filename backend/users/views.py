from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import CustomUserSerializer, UserRegistrationSerializer
from .email_service import send_verification_email
from .models import EmailVerificationToken

User = get_user_model()

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Send verification email
        email_sent, email_result = send_verification_email(user)
        
        return Response({
            'user': CustomUserSerializer(user).data,
            'message': 'User created successfully. Please check your email for verification.',
            'email_sent': email_sent,
            'debug': email_result if not email_sent else None
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_email(request, token):
    """Verify email using token"""
    try:
        verification_token = EmailVerificationToken.objects.get(token=token)
        
        if not verification_token.is_valid():
            return Response({
                'error': 'Invalid or expired verification link'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark user as verified
        user = verification_token.user
        user.is_verified = True
        user.save()
        
        # Mark token as used
        verification_token.is_used = True
        verification_token.save()
        
        return Response({
            'message': 'Email verified successfully! You can now log in.',
            'user': CustomUserSerializer(user).data
        }, status=status.HTTP_200_OK)
        
    except EmailVerificationToken.DoesNotExist:
        return Response({
            'error': 'Invalid verification link'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification_email(request):
    """Resend verification email"""
    try:
        email = request.data.get('email')
        user = User.objects.get(email=email)
        
        if user.is_verified:
            return Response({
                'message': 'Email is already verified'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        email_sent, email_result = send_verification_email(user)
        
        if email_sent:
            return Response({
                'message': 'Verification email sent successfully'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Failed to send verification email',
                'debug': email_result
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except User.DoesNotExist:
        return Response({
            'error': 'User with this email does not exist'
        }, status=status.HTTP_404_NOT_FOUND)
