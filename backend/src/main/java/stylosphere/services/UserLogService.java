package stylosphere.services;

// Import from stylosphere packages
import stylosphere.models.loghistory.*;
import stylosphere.repositories.UserLogRepository;

// Import from Spring Service and Autowired
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Import from standard Java packages
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserLogService {
    @Autowired
    private UserLogRepository userLogRepository;

    /**
     * Fetches the log history for a specific user for the last month.
     * @param userId The ID of the user whose log history is to be fetched.
     * @return List of UserLog objects representing the user's log history for the last month.
     */
    public List<UserLog> getMonthlyLogHistory(Long userId)
    {
        List<UserLog> logHistory = userLogRepository.findByUserId(userId);

        // Get the date one month ago
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        Date oneMonthAgo = calendar.getTime();

        // Filter the list for instances with a timestamp less than one month old
        logHistory = logHistory.stream()
            .filter(log -> log.getTimeStamp().after(oneMonthAgo))
            .collect(Collectors.toList());

        return logHistory;
    }

    /**
     * Fetches the full log history for a specific user.
     * @param userId The ID of the user whose full log history is to be fetched.
     * @return List of UserLog objects representing the user's full log history.
     */
    public List<UserLog> getFullLogHistory(Long userId)
    {
        List<UserLog> logHistory = userLogRepository.findByUserId(userId);
        return logHistory;
    }

    /**
     * Adds a new user log instance for a user.
     * @param userId The ID of the user for whom the log instance is being added.
     * @param device The device used by the user.
     * @param browser The browser used by the user.
     */
    public void addUserLog(Long userId , String device , String browser)
    {
        UserLog newUserLog = new UserLog(userId, device, browser);
        userLogRepository.save(newUserLog);
    }

}
