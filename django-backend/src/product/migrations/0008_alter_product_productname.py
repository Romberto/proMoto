# Generated by Django 5.0.4 on 2024-04-23 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0007_alter_category_is_employ'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='productName',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]