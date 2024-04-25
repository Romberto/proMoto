from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import AdminPanel, changeMenu,  CategoryView, ProductView

router = SimpleRouter()

router.register(r'api/category', CategoryView, basename='category')
router.register(r'api/product', ProductView, basename='product')

urlpatterns = [
    path('', AdminPanel.as_view(), name='admin'),
    path('api/changeMenu/', changeMenu, name='changeMenu'),

]

urlpatterns += router.urls

