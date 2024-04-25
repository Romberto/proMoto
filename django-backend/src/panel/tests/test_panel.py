from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.reverse import reverse

from panel.serializers import CategorySerializer
from product.models import Category, Product
from rest_framework.test import APITestCase


class TestAdminPanel(APITestCase):

    def setUp(self):
        self.test_image = SimpleUploadedFile("1695870652_gas-kvas-com-p-kartinki-pitstsa-5_4Cpq2u4.jpg",
                                             b"file_content", content_type="image/jpeg")
        self.pizza = Category.objects.create(category_name='пицца')
        self.burger = Category.objects.create(category_name='бургер')
        self.pizza_one = Product.objects.create(productName='пицца_Первая',
                                                category=self.pizza,
                                                price=10,
                                                productDescription='пицца Круглая ',
                                                is_employ=True)
        self.user = User.objects.create_user(username="testuser1", password='1234erSDD')

    def test_get_all_category(self):
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(CategorySerializer([self.pizza, self.burger], many=True).data, response.data)

    def test_serializer_category(self):
        data = CategorySerializer([self.pizza, self.burger], many=True).data
        expected_data = [
            {
                'id': self.pizza.id,
                'category_name': self.pizza.category_name,
                'is_employ': self.pizza.is_employ
            },
            {
                'id': self.burger.id,
                'category_name': self.burger.category_name,
                'is_employ': self.burger.is_employ
            }
        ]
        self.assertEqual(data, expected_data)

    def test_add_new_category(self):
        url = reverse('category-list')
        print(url)
        data = {
            'category_name': 'десерт'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        coutnt = Category.objects.count()
        self.assertEqual(coutnt, 3)
