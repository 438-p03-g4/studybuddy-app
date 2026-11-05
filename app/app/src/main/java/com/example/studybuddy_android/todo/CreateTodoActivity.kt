package com.example.studybuddy_android.todo

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.studybuddy_android.R
import com.example.studybuddy_android.ui.theme.StudyBuddyandroidTheme

private val StudyBuddyAccent = Color(0xFFF46524)
private val PageWhite = Color(0xFFFFFFFF)

class CreateTodoActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            StudyBuddyandroidTheme {
                CreateTodoScreen { finish() }
            }
        }
    }
}

@Composable
fun CreateTodoScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val todoStore = remember(context) {
        TodoStore(context.getSharedPreferences("todos", Context.MODE_PRIVATE))
    }

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
            // Header bar with back button
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(StudyBuddyAccent),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { onBack() }
                            .padding(horizontal = 8.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text("←", color = PageWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Text(
                            text = stringResource(R.string.back_button),
                            color = PageWhite,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    Text(
                        text = stringResource(R.string.create_todo_title),
                        color = PageWhite,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 24.dp)
            ) {
                TodoCreationForm { todo ->
                    val existing = todoStore.load()
                    todoStore.save(existing + todo)
                    onBack()
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun CreateTodoScreenPreview() {
    StudyBuddyandroidTheme {
        CreateTodoScreen {}
    }
}
