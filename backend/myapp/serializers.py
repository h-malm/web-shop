from rest_framework import serializers
from .models import CartModel, PageModel, Card
from django.contrib.auth.models import User

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartModel
        fields = "__all__"


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageModel
        fields = "__all__"


class UpdatePageSerializer(PageSerializer):
    updated = serializers.DateTimeField(required=True)


class LoginSerializer(serializers.Serializer):
    password = serializers.CharField(style={"input_type": "password"})
    username = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "password")

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)