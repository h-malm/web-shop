from django.db import models
from django.conf import settings

# Create your models here.


class Card(models.Model):
    color = models.TextField()
    price = models.DecimalField( max_digits=10, decimal_places=2, default=0.00 )
    title = models.CharField( default="No Title", max_length=200)
    description = models.TextField( default="No Description" )
    dateAdded = models.DateField( default="2001-01-01" )
    status = models.TextField( default="ON SALE" )
    # if we want the user id
    # owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # if we want the username
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, to_field="username", on_delete=models.CASCADE)


class CartModel(models.Model):
    color = models.CharField(max_length=30)
    title = models.TextField( default="No Title")
    price = models.DecimalField( max_digits=10, decimal_places=2, default=0.00 )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    dateAdded = models.DateField( default="2001-01-01" )

    class Meta:
        ordering = ["created"]


class PageModel(models.Model):
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created"]


