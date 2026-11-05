package com.example.studybuddy_android

import android.content.Context
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assert
import androidx.compose.ui.test.assertIsNotEnabled
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.text.AnnotatedString
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.example.studybuddy_android.todo.CreateTodoScreen
import com.example.studybuddy_android.todo.TodoCreationForm
import com.example.studybuddy_android.todo.TodoItem
import com.example.studybuddy_android.todo.TodoStore
import com.example.studybuddy_android.ui.theme.StudyBuddyandroidTheme
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class TodoCreationTest {
    @get:Rule
    val compose = createComposeRule()

    private val context = InstrumentationRegistry.getInstrumentation().targetContext

    @Test
    fun blankTitlePreventsCreation() {
        compose.setContent {
            StudyBuddyandroidTheme {
                TodoCreationForm { error("A blank todo must not be created") }
            }
        }
        compose.onNodeWithText(context.getString(R.string.todo_create)).assertIsNotEnabled()
        compose.onNodeWithText(context.getString(R.string.todo_title)).performTextInput("   ")
        compose.onNodeWithText(context.getString(R.string.todo_create)).assertIsNotEnabled()
    }

    @Test
    fun createsTaggedTodoAndClearsForm() {
        var created: TodoItem? = null
        compose.setContent {
            StudyBuddyandroidTheme { TodoCreationForm { created = it } }
        }
        compose.onNodeWithText(context.getString(R.string.todo_title))
            .performTextInput("  Review notes  ")
        compose.onNodeWithText(context.getString(R.string.todo_tag))
            .performTextInput("  CST 438  ")
        compose.onNodeWithText(context.getString(R.string.todo_create)).performClick()

        compose.runOnIdle {
            assertEquals("Review notes", created?.title)
            assertEquals("CST 438", created?.tag)
        }
        compose.onNodeWithText(context.getString(R.string.todo_title))
            .assert(SemanticsMatcher.expectValue(SemanticsProperties.EditableText, AnnotatedString("")))
        compose.onNodeWithText(context.getString(R.string.todo_tag))
            .assert(SemanticsMatcher.expectValue(SemanticsProperties.EditableText, AnnotatedString("")))
        compose.onNodeWithText(context.getString(R.string.todo_create)).assertIsNotEnabled()
    }

    @Test
    fun tagIsOptional() {
        var created: TodoItem? = null
        compose.setContent {
            StudyBuddyandroidTheme { TodoCreationForm { created = it } }
        }
        compose.onNodeWithText(context.getString(R.string.todo_title))
            .performTextInput("Read chapter 3")
        compose.onNodeWithText(context.getString(R.string.todo_create)).performClick()
        compose.runOnIdle {
            assertEquals("Read chapter 3", created?.title)
            assertEquals("", created?.tag)
        }
    }

    @Test
    fun savedTodosSurviveReload() {
        val preferences = context.getSharedPreferences("todo_storage_test", Context.MODE_PRIVATE)
        preferences.edit().clear().commit()
        try {
            val store = TodoStore(preferences)
            assertEquals(emptyList<TodoItem>(), store.load())
            val todos = listOf(
                TodoItem(title = "Review \"notes\"", tag = "CST 438"),
                TodoItem(title = "Read chapter 3"),
            )
            store.save(todos)
            assertEquals(todos, TodoStore(preferences).load())
        } finally {
            preferences.edit().clear().commit()
        }
    }

    @Test
    fun createTodoScreenInvokesBackOnCreation() {
        var backInvoked = false
        compose.setContent {
            StudyBuddyandroidTheme {
                CreateTodoScreen { backInvoked = true }
            }
        }
        compose.onNodeWithText(context.getString(R.string.todo_title))
            .performTextInput("New secondary todo")
        compose.onNodeWithText(context.getString(R.string.todo_create)).performClick()
        compose.runOnIdle {
            assertTrue(backInvoked)
        }
    }
}
