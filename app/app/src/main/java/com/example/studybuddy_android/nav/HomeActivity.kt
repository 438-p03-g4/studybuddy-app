package com.example.studybuddy_android

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
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.studybuddy_android.ui.theme.StudyBuddyandroidTheme

// Accent color: #f46524.
private val StudyBuddyAccent = Color(0xFFF46524)
private val PageWhite = Color(0xFFFFFFFF)
private val TextDark = Color(0xFF242424)
private val MutedText = Color(0xFF777777)

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
    var menuExpanded by remember { mutableStateOf(false) }
    // Replace this empty list with the user's active timers when timer data is available.
    val activeTimers = emptyList<String>()

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = PageWhite
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(PageWhite)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PageWhite)
                    .padding(horizontal = 20.dp, vertical = 14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        StudyBuddyLogoMark()
                        Text(
                            text = "StudyBuddy",
                            color = TextDark,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { /* TODO: Open the user's settings page. */ }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        UserAvatar()
                        Text(
                            text = "<username>",
                            color = TextDark,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Medium
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
                contentAlignment = Alignment.CenterStart
            ) {
                Box {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { menuExpanded = true }
                            .padding(horizontal = 18.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("☰", color = PageWhite, fontSize = 23.sp, lineHeight = 24.sp)
                        Text(
                            text = "Menu",
                            color = PageWhite,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        listOf(
                            "My Study Groups",
                            "Find Study Groups",
                            "Create Study Timer"
                        ).forEach { label ->
                            DropdownMenuItem(
                                text = { Text(label) },
                                onClick = { menuExpanded = false }
                            )
                        }
                    }
                }
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(PageWhite),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    horizontal = 20.dp,
                    vertical = 22.dp
                ),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (activeTimers.isEmpty()) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 26.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Active Study Timers",
                                color = TextDark,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(30.dp))
                            Text(
                                text = "No Active Timers",
                                color = MutedText,
                                fontSize = 16.sp
                            )
                        }
                    }
                } else {
                    item {
                        Text(
                            text = "Active Study Timers",
                            color = TextDark,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
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
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(9.dp.toPx())
        )
        val bookColor = PageWhite
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.5f, size.height * 0.3f),
            end = Offset(size.width * 0.5f, size.height * 0.76f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.5f, size.height * 0.37f),
            end = Offset(size.width * 0.26f, size.height * 0.31f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.5f, size.height * 0.37f),
            end = Offset(size.width * 0.74f, size.height * 0.31f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.26f, size.height * 0.31f),
            end = Offset(size.width * 0.26f, size.height * 0.69f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.74f, size.height * 0.31f),
            end = Offset(size.width * 0.74f, size.height * 0.69f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.26f, size.height * 0.69f),
            end = Offset(size.width * 0.5f, size.height * 0.76f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round
        )
        drawLine(
            color = bookColor,
            start = Offset(size.width * 0.74f, size.height * 0.69f),
            end = Offset(size.width * 0.5f, size.height * 0.76f),
            strokeWidth = 1.8.dp.toPx(),
            cap = StrokeCap.Round
        )
    }
}

@Composable
private fun UserAvatar() {
    Canvas(
        modifier = Modifier
            .size(34.dp)
            .clip(CircleShape)
            .background(Color(0xFFFFE8DC))
    ) {
        val iconColor = StudyBuddyAccent
        drawCircle(
            color = iconColor,
            radius = size.minDimension * 0.14f,
            center = Offset(size.width * 0.5f, size.height * 0.36f)
        )
        drawArc(
            color = iconColor,
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = true,
            topLeft = Offset(size.width * 0.2f, size.height * 0.48f),
            size = androidx.compose.ui.geometry.Size(size.width * 0.6f, size.height * 0.42f)
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
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = timer,
            color = TextDark,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium
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
