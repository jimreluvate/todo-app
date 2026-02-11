from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('me/', views.user_profile, name='current_user'),
    path('verify/<uuid:token>/', views.verify_email, name='verify_email'),
    path('resend-verification/', views.resend_verification_email, name='resend_verification'),
]
