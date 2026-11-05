package com.jobtracker.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Dashboard statistics returned for the summary cards and charts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // Summary counts
    private long totalApplications;
    private long appliedCount;
    private long assessmentCount;
    private long interviewScheduledCount;
    private long selectedCount;
    private long rejectedCount;

    // For charts
    private List<MonthlyData> monthlyData;

    /**
     * Represents application count per month (for bar chart).
     */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyData {
        private String month;   // e.g. "Jan", "Feb"
        private long count;
    }
}
