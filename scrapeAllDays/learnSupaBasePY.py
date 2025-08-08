
import os
from supabase import create_client, Client, ClientOptions

url: str = os.environ.get("SUPABASE_URL")
service_key: str = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not service_key:
    raise ValueError("Supabase URL or Service Role Key is not set in the environment!")

supabase: Client = create_client(
    url, 
    service_key,
    options=ClientOptions(
        postgrest_client_timeout=4,
        storage_client_timeout=4,
        schema="public",
    )
)

try:
    tables = supabase.table("danceClassStorage").select("count").execute()
    print("Connected to database")
except Exception as e:
    print("Connection error:", str(e))

# # # ...existing code...
# # try:
# #     response = (
# #         supabase.table("danceClassStorage")
# #         .select("*")
# #         .execute()
# #     )
    
# #     response_data = response.data
# #     print(f"Response data type: {type(response_data)}")
    
# # except Exception as e:
# #     print("Error retrieving rows:", str(e))
    
    
# response_data = response.data

# firstClass = response.data[1]
# firstClassInstructor = response.data[1].get('instructor')
# firstClassItemsTouple = response.data[1].items() # not needed

# print(response.data)


# print(f"first class type: {type(firstClass)}")
# print(firstClass)
# print(f"first class instructor type: {type(firstClassInstructor)}")
# print(firstClassInstructor)
# # print(f"first class itemstouple type: {type(firstClassItemsTouple)}") # not needed
# # print(firstClassItemsTouple) # not needed

class_item = ('Int/Adv. Commercial Ballet', 'Lisa Ebeyer', '$22.00', '11:00am', '120 min', 'Friday, April 11', 'TMILLY')
class_dict_item = {'classname' : 'testclassname',
                   'instructor' : 'testclassinsturctor',
                   'price'  : 'testclassprice',
                   'time' : 'testclasstiem',
                   'length' : 'testclasslenght',
                   'date' : 'testclass',
                   'studio' : 'testclass'}

week_classes_dict = [{'classname': 'Beginner Commercial Ballet', 'instructor': 'Lisa Ebeyer', 'price': '$22.00', 'time': '1:00pm', 'length': '90 min', 'date': 'Monday, April 7', 'studio': 'TMILLY'}, {'classname': 'Performance Hip Hop', 'instructor': 'Cedric Botelho', 'price': '$22.00', 'time': '4:00pm', 'length': '90 min', 'date': 'Monday, April 7', 'studio': 'TMILLY'}, {'classname': 'Contemporary Fusion', 'instructor': 'Trey Barrett', 'price': '$22.00', 'time': '5:30pm', 'length': '90 min', 'date': 'Monday, April 7', 'studio': 'TMILLY'}, {'classname': 'Contemporary Fusion', 'instructor': 'Coco Joelle', 'price': '$22.00', 'time': '7:00pm', 'length': '90 min', 'date': 'Monday, April 7', 'studio': 'TMILLY'}, {'classname': 'Pop-Up: Hip Hop Fundamentals', 'instructor': 'Jaylin Sanders', 'price': '$22.00', 'time': '8:30pm', 'length': '90 min', 'date': 'Monday, April 7', 'studio': 'TMILLY'}, {'classname': 'Jazz', 'instructor': 'Malia Baker', 'price': '$22.00', 'time': '1:00pm', 'length': '90 min', 'date': 'Tuesday, April 8', 'studio': 'TMILLY'}, {'classname': 'House', 'instructor': 'Ray Basa', 'price': '$22.00', 'time': '2:30pm', 'length': '90 min', 'date': 'Tuesday, April 8', 'studio': 'TMILLY'}, {'classname': 'Jazz Funk', 'instructor': 'Matthew Pilalis', 'price': '$22.00', 'time': '4:00pm', 'length': '90 min', 'date': 'Tuesday, April 8', 'studio': 'TMILLY'}, {'classname': 'Heels', 'instructor': 'Monica Giavanna', 'price': '$22.00', 'time': '7:00pm', 'length': '90 min', 'date': 'Tuesday, April 8', 'studio': 'TMILLY'}, {'classname': 'Choreography', 'instructor': 'Taneesky .', 'price': '$22.00', 'time': '8:15pm', 'length': '90 min', 'date': 'Tuesday, April 8', 'studio': 'TMILLY'}, {'classname': 'Cha Cha', 'instructor': 'Tristen Sosa', 'price': '$22.00', 'time': '8:30pm', 'length': '90 min', 'date': 'Tuesday, April 8', 'studio': 'TMILLY'}, {'classname': 'Entity Contemporary Dance - Open Class', 'instructor': 'Diana Schoenfield', 'price': '$22.00', 'time': '1:00pm', 'length': '90 min', 'date': 'Wednesday, April 9', 'studio': 'TMILLY'}, {'classname': 'Street Jazz', 'instructor': 'Liz Guerrieri', 'price': '$22.00', 'time': '2:30pm', 'length': '90 min', 'date': 'Wednesday, April 9', 'studio': 'TMILLY'}, {'classname': 'Contemporary Fusion', 'instructor': 'Renee Baldwin', 'price': '$22.00', 'time': '4:00pm', 'length': '90 min', 'date': 'Wednesday, April 9', 'studio': 'TMILLY'}, {'classname': 'Contemporary', 'instructor': 'Megan Goldstein', 'price': '$22.00', 'time': '5:30pm', 'length': '90 min', 'date': 'Wednesday, April 9', 'studio': 'TMILLY'}, {'classname': 'Pop-Up: Jazz Fusion', 'instructor': 'Aaron Adam', 'price': '$22.00', 'time': '7:00pm', 'length': '90 min', 'date': 'Wednesday, April 9', 'studio': 'TMILLY'}, {'classname': 'Beginner Hip Hop', 'instructor': 'Cedric Botelho', 'price': '$22.00', 'time': '8:00pm', 'length': '90 min', 'date': 'Wednesday, April 9', 'studio': 'TMILLY'}, {'classname': 'Contemporary Fusion', 'instructor': 'Gina Starbuck', 'price': '$22.00', 'time': '2:30pm', 'length': '90 min', 'date': 'Thursday, April 10', 'studio': 'TMILLY'}, {'classname': 'Stage Performance', 'instructor': 'Minor Enrique', 'price': '$22.00', 'time': '4:00pm', 'length': '90 min', 'date': 'Thursday, April 10', 'studio': 'TMILLY'}, {'classname': 'Rhythm & Grooves', 'instructor': 'Joe Brown', 'price': '$22.00', 'time': '6:45pm', 'length': '90 min', 'date': 'Thursday, April 10', 'studio': 'TMILLY'}, {'classname': 'Pop-Up: Jazz Funk', 'instructor': 'Ruby Pappan', 'price': '$22.00', 'time': '8:30pm', 'length': '90 min', 'date': 'Thursday, April 10', 'studio': 'TMILLY'}, {'classname': 'Int/Adv. Commercial Ballet', 'instructor': 'Lisa Ebeyer', 'price': '$22.00', 'time': '11:00am', 'length': '120 min', 'date': 'Friday, April 11', 'studio': 'TMILLY'}, {'classname': 'House Drills & Foundation', 'instructor': 'Ray Basa', 'price': '$22.00', 'time': '1:00pm', 'length': '90 min', 'date': 'Friday, April 11', 'studio': 'TMILLY'}, {'classname': 'Jazz Funk', 'instructor': 'Emily Chamberlain', 'price': '$22.00', 'time': '2:30pm', 'length': '90 min', 'date': 'Friday, April 11', 'studio': 'TMILLY'}, {'classname': 'Contemporary Fusion', 'instructor': 'Corrie Wyse', 'price': '$22.00', 'time': '4:00pm', 'length': '90 min', 'date': 'Friday, April 11', 'studio': 'TMILLY'}, {'classname': 'Hip Hop', 'instructor': 'Aryes Cox', 'price': '$22.00', 'time': '5:30pm', 'length': '90 min', 'date': 'Friday, April 11', 'studio': 'TMILLY'}]

try:
    response = (
    supabase.table("danceClassStorage")
    .insert(week_classes_dict)
    .execute()
    )
    print("import dictionary of classes sucess")
except Exception as e:
    print("Error insertingss:", str(e))