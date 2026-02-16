from django.urls import path
from . import views
from api.views import *

urlpatterns = [
    path('products/create/', views.create_product, name='create_product'),
    path('products/', views.get_products, name='get_products'),
]