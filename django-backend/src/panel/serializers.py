from rest_framework.fields import FileField, BooleanField
from rest_framework.serializers import ModelSerializer

from product.models import Category, Product


class CategorySerializer(ModelSerializer):
    is_employ = BooleanField(required=False)

    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    image = FileField(required=False)

    class Meta:
        model = Product
        fields = '__all__'

    def update(self, instance, validated_data):
        # Проверяем, был ли отправлен файл для поля 'image'
        image_file = validated_data.get('image')
        if image_file:
            # Если файл был отправлен, обновляем поле 'image' в модели
            instance.image = image_file
        # Затем обновляем остальные поля модели
        instance.productName = validated_data.get('productName', instance.productName)
        instance.category = validated_data.get('category', instance.category)
        instance.price = validated_data.get('price', instance.price)
        instance.productDescription = validated_data.get('productDescription', instance.productDescription)
        instance.is_employ = validated_data.get('is_employ', instance.is_employ)
        # Сохраняем обновленную модель
        instance.save()
        return instance
