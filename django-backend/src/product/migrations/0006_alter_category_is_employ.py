# Generated by Django 5.0.4 on 2024-04-20 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0005_category_is_employ'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='is_employ',
            field=models.BooleanField(default=True),
        ),
    ]
