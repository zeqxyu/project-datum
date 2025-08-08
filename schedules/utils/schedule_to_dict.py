from schedules.models import Schedule, ScheduleSlot, Subject

def schedule_to_dict(schedule_obj):
    # Предполагается, что schedule_obj — объект Schedule
    
    result = {
        "class_code": schedule_obj.class_ref.code,
        "valid_from": schedule_obj.valid_from,
        "comment": schedule_obj.comment,
        "schedule": []
    }
    
    # Инициализируем пустой шаблон расписания: 6 дней (0-5), каждый с 8 уроками (0-й None)
    for _ in range(6):
        day_list = [None] + [None] * 10  # 8 элементов, 0-й None
        result["schedule"].append(day_list)
    
    slots = list(ScheduleSlot.objects.filter(schedule=schedule_obj).all())
    
    for slot in slots:
        day = slot.day
        hour = slot.hour
        subject_code = slot.subject.code
        # Помещаем код предмета по месту в расписании
        result["schedule"][day][hour] = subject_code
    
    return result