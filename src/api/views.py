import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Product


# @csrf_exempt - отключает защиту от CSRF для этого view (нужно для API)
# @require_http_methods(["POST"]) - разрешает только POST запросы
@csrf_exempt
@require_http_methods(["POST"])
def create_product(request):
    """
    API endpoint для создания нового продукта в БД
    Ожидает JSON с полями: name, price, description, in_stock (опционально)
    """
    try:
        # 1. Парсим JSON из тела запроса
        # request.body содержит сырые данные запроса
        # json.loads преобразует JSON строку в словарь Python
        data = json.loads(request.body)

        # 2. Валидация обязательных полей
        required_fields = ['name', 'price', 'description']
        for field in required_fields:
            if field not in data:
                return JsonResponse(
                    {'error': f'Поле {field} обязательно для заполнения'},
                    status=400
                )

        # 3. Валидация типов данных
        if not isinstance(data['price'], (int, float)):
            return JsonResponse(
                {'error': 'Цена должна быть числом'},
                status=400
            )

        # 4. Создание объекта в БД
        # Метод objects.create() сразу создает и сохраняет запись
        product = Product.objects.create(
            name=data['name'],
            price=float(data['price']),  # Преобразуем в float для надежности
            description=data['description'],
            in_stock=data.get('in_stock', True)  # Если поле не указано, ставим True
        )

        # 5. Формируем успешный ответ
        response_data = {
            'status': 'success',
            'message': 'Продукт успешно создан',
            'product': {
                'id': product.id,
                'name': product.name,
                'price': str(product.price),  # Decimal в строку для JSON
                'description': product.description,
                'in_stock': product.in_stock,
                'created_at': product.created_at.isoformat()  # Дата в ISO формат
            }
        }

        return JsonResponse(response_data, status=201)  # 201 - Created

    except json.JSONDecodeError:
        # Ошибка парсинга JSON
        return JsonResponse(
            {'error': 'Неверный формат JSON'}, 
            status=400
        )
    except Exception as e:
        # Любая другая ошибка
        return JsonResponse(
            {'error': f'Ошибка сервера: {str(e)}'}, 
            status=500
        )


# Дополнительный GET метод для проверки
@csrf_exempt
@require_http_methods(["GET"])
def get_products(request):
    """Получение списка всех продуктов"""
    try:
        products = Product.objects.all()
        products_data = []

        for product in products:
            products_data.append({
                'id': product.id,
                'name': product.name,
                'price': str(product.price),
                'description': product.description,
                'in_stock': product.in_stock,
                'created_at': product.created_at.isoformat()
            })

        return JsonResponse({
            'status': 'success',
            'count': len(products_data),
            'products': products_data
        }, status=200)

    except Exception as e:
        return JsonResponse(
            {'error': f'Ошибка: {str(e)}'}, 
            status=500
        )
