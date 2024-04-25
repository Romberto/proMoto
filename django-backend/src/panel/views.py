import json

from django.contrib.auth.decorators import login_required
from django.db.models import F
from django.http import JsonResponse, QueryDict
from django.shortcuts import render, redirect
from django.views import View
from django.views.decorators.http import require_GET
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework import parsers
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.viewsets import ModelViewSet

from menu.forms import ProductForm
from panel.serializers import CategorySerializer, ProductSerializer
from product.models import Category, Product


class AdminPanel(View):

    def get(self, request):
        if not request.user.is_authenticated:
            return redirect('login')
        else:
            form = ProductForm()
            return render(request, 'panel/adminPanel.html', {'form': form})


def changeMenu(request):
    try:
        changeList = request.POST.get('changeList')
        clean_string = changeList.replace("[", "").replace("]", "").replace('"', "")
        # Разделяем строку по запятой и преобразуем каждый элемент в целое число
        digits = [int(digit) for digit in clean_string.split(",")]

        Product.objects.filter(id__in=digits).update(is_employ=~F('is_employ'))

        data = {'changeList': True}
        return JsonResponse(data)
    except ValueError:
        raise Exception()



@require_GET
def getAllCategory(request):
    """
    возвращает список всех категорий
    :param request:
    :return: list of categories
    """
    if not request.user.is_authenticated:
        raise Exception()
    else:
        categories = Category.objects.all()
        data_json = list(categories.values())
        return JsonResponse(data_json, safe=False)


@login_required
def getAllProduct(request):
    products = Product.objects.all()
    data_json = list(products.values())
    return JsonResponse(data_json, safe=False)


class MultipartJsonParser(parsers.MultiPartParser):

    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )
        data = {}
        print("* " * 30)
        print(result.data)
        print("* " * 30)

        # find the data field and parse it
        data = json.loads(result.data)
        qdict = QueryDict('', mutable=True)
        qdict.update(data)
        return parsers.DataAndFiles(qdict, result.files)


class CategoryView(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_employ']
    ordering_fields = ['id', ]


class ProductView(ModelViewSet):
    queryset = Product.objects.all().select_related('category')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['category']
    parser_classes = [MultiPartParser, FormParser]
    ordering_fields = ['id', ]