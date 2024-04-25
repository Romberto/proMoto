from product.models import Product
from django.core.exceptions import ValidationError
from django import forms


def photo_valid(value):
    ext = value.name.split('.')[-1].lower()
    if ext not in ['png', 'jpg', 'jpeg']:
        raise ValidationError("расширение файла может быть 'png', 'jpg', 'jpeg'")


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ('productName', 'price', 'productDescription', 'category', 'image')

    def __init__(self, *args, **kwargs):
        super(ProductForm, self).__init__(*args, **kwargs)
        self.fields['productName'].widget.attrs['placeholder'] = "название продукта"
        self.fields['productName'].widget.attrs['class'] = 'form-control mb-2 w-75'

        self.fields['price'].widget.attrs['placeholder'] = "цена"
        self.fields['price'].widget.attrs['class'] = 'form-control mb-2 w-50'

        self.fields['productDescription'].widget.attrs['rows'] = "3"
        self.fields['productDescription'].widget.attrs['placeholder'] = "краткое описание"
        self.fields['productDescription'].widget.attrs['class'] = 'form-control mb-2'

        self.fields['category'].label = "категория продукта"
        self.fields['category'].widget.attrs['class'] = 'form-select mb-2 w-50'

        self.fields['image'].widget.attrs['placeholder'] = 'загрузите фото 800х600px'
        self.fields['image'].widget.attrs['class'] = 'form-control mb-2'
        self.fields['image'].help_text = '800х600px или кратное этим размерам'

    image = forms.ImageField(validators=[photo_valid])
