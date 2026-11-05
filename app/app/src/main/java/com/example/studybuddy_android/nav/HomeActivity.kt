package com.example.studybuddy_android.nav

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.example.studybuddy_android.R
import com.example.studybuddy_android.todo.CreateTodoActivity
import com.example.studybuddy_android.todo.TodoListItem
import com.example.studybuddy_android.todo.TodoStore
import com.example.studybuddy_android.ui.theme.StudyBuddyandroidTheme

// Accent colors
private val StudyBuddyAccent = Color(0xFFF46524) // for light mode accent
private val PageWhite = Color(0xFFFFFFFF) // for light mode background
private val TextDark = Color(0xFF242424) // for light mode text
private val MutedText = Color(0xFF777777) // all-around muted text

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            StudyBuddyandroidTheme {
                StudyBuddyHomePage()
            }
        }
    }
}

@Composable
private fun StudyBuddyHomePage() {
    var menuExpanded by remember { mutableStateOf(value = false) }
    val context = LocalContext.current
    val todoStore = remember(context) {
        TodoStore(context.getSharedPreferences("todos", Context.MODE_PRIVATE))
    }
    var todos by remember(todoStore) { mutableStateOf(todoStore.load()) }

    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                todos = todoStore.load()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    // Replace this empty list with the user's active timers when timer data is available.
    val activeTimers = emptyList<String>()

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = PageWhite,
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(PageWhite),
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PageWhite)
                    .padding(horizontal = 20.dp, vertical = 14.dp),
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        StudyBuddyLogoMark()
                        Text(
                            text = "StudyBuddy",
                            color = TextDark,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                        )
                    }

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { /* Open settings */ }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        UserAvatar()
                        Text(
                            text = "<username>",
                            color = TextDark,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Medium,
                        )
                    }
                }
            }

            // Accent navigation bar separates the account area from the home page content.
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .background(StudyBuddyAccent),
                contentAlignment = Alignment.CenterStart,
            ) {
                Box {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { menuExpanded = true }
                            .padding(horizontal = 18.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Text("☰", color = PageWhite, fontSize = 23.sp, lineHeight = 24.sp)
                        Text(
                            text = "Menu",
                            color = PageWhite,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false },
                    ) {
                        listOf(
                            "My Study Groups",
                            "Find Study Groups",
                            "Create Study Timer",
                        ).forEach { label ->
                            DropdownMenuItem(
                                text = { Text(label) },
                                onClick = { menuExpanded = false },
                            )
                        }
                    }
                }
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(PageWhite),
                contentPadding = PaddingValues(
                    horizontal = 20.dp,
                    vertical = 22.dp,
                ),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item(key = "todo_header") {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = stringResource(R.string.todo_heading),
                            color = TextDark,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                        )
                        Button(
                            onClick = {
                                val intent = Intent(context, CreateTodoActivity::class.java)
                                context.startActivity(intent)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = StudyBuddyAccent),
                            shape = RoundedCornerShape(8.dp),
                        ) {
                            Text(
                                text = stringResource(R.string.add_todo_button),
                                color = PageWhite,
                            )
                        }
                    }
                }
                if (todos.isEmpty()) {
                    item(key = "todos_empty") {
                        Text(
                            text = stringResource(R.string.todo_empty),
                            color = MutedText,
                            fontSize = 16.sp,
                        )
                    }
                }
                items(todos, key = { it.id }) { todo ->
                    TodoListItem(todo)
                }
                if (activeTimers.isEmpty()) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 26.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text(
                                text = "Active Study Timers",
                                color = TextDark,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                            )
                            Spacer(modifier = Modifier.height(30.dp))
                            Text(
                                text = "No Active Timers",
                                color = MutedText,
                                fontSize = 16.sp,
                            )
                        }
                    }
                } else {
                    item {
                        Text(
                            text = "Active Study Timers",
                            color = TextDark,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                    items(activeTimers.size) { index ->
                        TimerListItem(activeTimers[index])
                    }
                }
            }
        }
    }
}

@Composable
private fun StudyBuddyLogoMark() {
    Canvas(modifier = Modifier.size(34.dp)) {
        drawRoundRect(
            color = StudyBuddyAccent,
            cornerRadius = CornerRadius(9.dp.toPx()),
        )
        val bookColor = PageWhite
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.5f, size.height * 0.3f),
            end = Offset(size.width * 0.5f, size.height * 0.76f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round,
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.5f, size.height * 0.37f),
            end = Offset(size.width * 0.26f, size.height * 0.31f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round,
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.5f, size.height * 0.37f),
            end = Offset(size.width * 0.74f, size.height * 0.31f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round,
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.26f, size.height * 0.31f),
            end = Offset(size.width * 0.26f, size.height * 0.69f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round,
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.74f, size.height * 0.31f),
            end = Offset(size.width * 0.74f, size.height * 0.69f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round,
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.26f, size.height * 0.69f),
            end = Offset(size.width * 0.5f, size.height * 0.76f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round,
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.74f, size.height * 0.69f),
            end = Offset(size.width * 0.5f, size.height * 0.76f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round,
        )
    }
}

@Composable
private fun UserAvatar() {
    Canvas(
        modifier = Modifier
            .size(34.dp)
            .clip(CircleShape)
            .background(Color(0xFFFFE8DC)),
    ) {
        val iconColor = StudyBuddyAccent
        drawCircle(
            color = iconColor,
            radius = size.minDimension * 0.14f,
            center = Offset(size.width * 0.5f, size.height * 0.36f),
        )
        drawArc(
            color = iconColor,
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = true,
            topLeft = Offset(size.width * 0.2f, size.height * 0.48f),
            size = Size(size.width * 0.6f, size.height * 0.42f),
        )
    }
}

@Composable
private fun TimerListItem(timer: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFFFFF7F2))
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = timer,
            color = TextDark,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun StudyBuddyHomePagePreview() {
    StudyBuddyandroidTheme {
        StudyBuddyHomePage()
    }
}
