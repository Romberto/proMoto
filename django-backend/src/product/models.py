from io import BytesIO

from PIL import Image
from django.core.files import File
from django.db import models


def content_file_name(instance, filename):
    return '/'.join(['products', str(instance.category.id), filename])


def compress(image):  # you can compress the images before upload into AWS
    im = Image.open(image)
    # create a BytesIO object
    im_io = BytesIO()
    # save image to BytesIO object
    im.save(im_io, 'JPEG', quality=70)
    # create a django-friendly Files object
    new_image = File(im_io, name=image.name)
    return new_image


class Category(models.Model):
    category_name = models.CharField(max_length=100)
    is_employ = models.BooleanField(default=True, blank=True)

    def __str__(self):
        return self.category_name


class Product(models.Model):
    productName = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    productDescription = models.TextField(max_length=190)
    is_employ = models.BooleanField(default=False)
    image = models.ImageField(upload_to=content_file_name, blank=True, null=True)

    def __str__(self):
        return self.productName

    def save(self, *args, **kwargs):
        # Вызываем родительский метод save
        super().save(*args, **kwargs)

        if self.image:
            img = Image.open(self.image.path)
            max_width = 700
            max_height = 400

            # Проверяем размеры изображения
            if img.width > max_width or img.height > max_height:
                # Обрезаем изображение
                img.thumbnail((max_width, max_height))
                img.save(self.image.path)
