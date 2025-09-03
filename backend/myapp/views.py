import random

from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .serializers import (
    CartSerializer,
    LoginSerializer,
    RegisterSerializer,
    PageSerializer,
    UpdatePageSerializer,
    CardSerializer,
    ChangePasswordSerializer,
)
from .models import CartModel, PageModel, Card

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

import datetime

from datetime import date
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from rest_framework import status
from django.contrib.auth.hashers import check_password



def populate(request):
    # clear the DB
    User.objects.all().delete()
    Card.objects.all().delete()

    #populatewith no_u users and no_c cards each
    no_u = 3
    no_c = 10
    try:
        color_list = [ 
                      'mistyrose', 
                      'thistle', 
                      'slategray' 
                    ]
        price_list = [ 
                      '39.99', 
                      '14.90', 
                      '22.99', 
                      '99.99',
                      '89.99',
                    ]
        title_list = [ 
                      'Helianthus annuus', 
                      'Pteridophyta', 
                      'Cactaceae', 
                      'Lavandula', 
                      'Bambusoideae', 
                      'Chlorophytum comosum' 
                    ]
        
        description_list = [ 
                      'A leafy plant that grows in a pot.', 
                      'A plant with long, arching leaves that can grow little offshoots.', 
                      'A plant with velvety leaves and some interesting patterns.', 
                      'A large plant with broad leaves.', 
                      'A tall plant with large leaves.', 
                      'A plant with soft, shiny leaves.' 
                    ]
        for n in range( no_u ):
            user = User.objects.create_user( "testuser{}".format( n ), "testuser{}@shop.aa".format( n ), "pass{}".format(n))
            user.save()

            for i in range( no_c ):
                item = Card( color = random.choice( color_list ), 
                            price = random.choice( price_list ),
                            title = random.choice( title_list ),
                            description = random.choice( description_list ),
                            dateAdded = date.today(),
                            owner = user 
                        )
                item.save()
        message = "{} users and {} cards added to the database".format( no_u, no_c )
    except Exception as e:
        message = "Populate failed:  " + str(e)
    return JsonResponse({"message": message})


class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        if not user.check_password(old_password):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)

        return Response({"detail": "Password has been changed successfully."}, status=status.HTTP_200_OK)

    
class AboutMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(f"you are: {request.user.get_username()}")


class SessionAboutMeView(AboutMeView):
    authentication_classes = [authentication.SessionAuthentication]


class RegisterView(APIView):
    """
    Register a new user
    """

    serializer_class = RegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        try:
            user = User.objects.create_user(
                username=serializer.data["username"],
                email=serializer.data["email"],
                password=serializer.data["password"],
            )
        except IntegrityError:
            return Response(f"same user name", status=400)
        if user is not None:
            return Response(f"new user created: {user.get_username()}")
        return Response("no new user")


class LoginView(APIView):
    """
    Login a user
    """

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        user = authenticate(
            username=serializer.data["username"], password=serializer.data["password"]
        )
        if user is not None:
            login(request, user)
            return Response(f"is logged in: {user.get_username()}")
        return Response("not logged in")


class CartView(viewsets.ModelViewSet):
    queryset = CartModel.objects.all()
    serializer_class = CartSerializer


class PageView(viewsets.ModelViewSet):
    queryset = PageModel.objects.all()

    @property
    def serializer_class(self):
        if self.request.method == "PUT":
            return UpdatePageSerializer
        return PageSerializer

    def update(self, request, pk=None):
        page = self.get_object()
        serializer = self.serializer_class(page, data=request.data)
        is_valid = serializer.is_valid()
        if not is_valid:
            return Response(serializer.errors, 400)

        if serializer.validated_data["updated"] < page.updated:
            # the status code means the content is modified
            # https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
            # send back latest model instance
            return Response(self.serializer_class(page).data, 409)
        serializer.save()
        return Response(data=serializer.data)


def hello(request):
    return HttpResponse("Hello")


def great(request, name):
    return HttpResponse(f"Hello, {name}")


def nicergreat(request, name):
    return render(request, "mytemplate.html", {"aname": name})


def cards(request, count):
    alllist = ["red", "blue", "yellow", "green"]
    colorlist = alllist[:count]
    return render(request, "cardsTemplate.html", {"color_list": colorlist})
