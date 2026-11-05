package com.example.studybuddy_android.todo

import android.content.SharedPreferences
import androidx.core.content.edit
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

data class TodoItem(
    val title: String,
    val tag: String = "",
    val id: String = UUID.randomUUID().toString(),
)

/** Local storage until account-backed todo data is available. */
class TodoStore(private val preferences: SharedPreferences) {
    fun load(): List<TodoItem> {
        val items = JSONArray(preferences.getString("items", "[]") ?: "[]")
        return List(items.length()) { index ->
            val item = items.getJSONObject(index)
            TodoItem(
                title = item.getString("title"),
                tag = item.optString("tag", ""),
                id = item.getString("id"),
            )
        }
    }

    fun save(items: List<TodoItem>) {
        val json = JSONArray()
        items.forEach { todoItem ->
            json.put(
                JSONObject().apply {
                    put("id", todoItem.id)
                    put("title", todoItem.title)
                    put("tag", todoItem.tag)
                },
            )
        }
        preferences.edit {
            putString("items", json.toString())
        }
    }
}
